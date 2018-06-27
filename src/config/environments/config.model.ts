export interface Config {
    db: {
        connectionString: string;
        dbName: string;
    };
    schedule: {
        columns: string[],
        rows: number;
        hours: object;
    };
}