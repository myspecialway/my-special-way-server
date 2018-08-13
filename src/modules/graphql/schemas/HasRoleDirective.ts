import { SchemaDirectiveVisitor } from "graphql-tools";
import { defaultFieldResolver } from "graphql";

export class HasRoleDirective extends SchemaDirectiveVisitor {

    visitObject(type) {
        this.ensureFieldsWrapped(type);
        type._requiredRoles = this.args.roles;
    }

    // Visitor methods for nested types like fields and arguments
    // also receive a details object that provides information about
    // the parent and grandparent types.
    public visitFieldDefinition(field, details) {
        this.ensureFieldsWrapped(details.objectType);
        field._requiredRoles = this.args.roles;
    }

    ensureFieldsWrapped(objectType) {
        // Mark the GraphQLObjectType object to avoid re-wrapping:
        if (objectType._authFieldsWrapped) return;
        objectType._authFieldsWrapped = true;

        const fields = objectType.getFields();

        Object.keys(fields).forEach(fieldName => {
            const field = fields[fieldName];
            const { resolve = defaultFieldResolver } = field;
            field.resolve = async function (...args) {
                // Get the required Role from the field first, falling back
                // to the objectType if no Role is required by the field:
                const requiredRoles =
                    field._requiredRoles ||
                    objectType._requiredRoles;

                if (! requiredRoles) {
                    return resolve.apply(this, args);
                }

                const context = args[2];
                const user = context.user;
                if (! (user.role in requiredRoles)) {
                    throw new Error("authorization error");
                }

                return resolve.apply(this, args);
            };
        });
    }
}