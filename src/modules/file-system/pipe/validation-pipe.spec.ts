import * as Joi from 'joi';
import { JoiValidationPipe } from './validation-pipe';
import { BadRequestException } from '@nestjs/common';

describe.only('file-system guard', () => {
  const uploadschema = Joi.object().keys({
    floor: Joi.number()
      .min(-100)
      .max(100)
      .required(),
    mapName: Joi.required(),
  });
  const joiValidationPipe = new JoiValidationPipe(uploadschema);

  it('joiValidationPipe should pass for valid body', async () => {
    const isValid = joiValidationPipe.transform({ floor: 1, mapName: 'fake name' }, null);
    expect(isValid).toBeTruthy();
  });

  it('joiValidationPipe should faild for invalid body part 1', async () => {
    try {
      const isValid = joiValidationPipe.transform({ floor: 1 }, null);
    } catch (error) {
      expect((error as BadRequestException).message.message).toBe('Validation failed');
    }
  });

  it('joiValidationPipe should faild for invalid body part 2', async () => {
    try {
      const isValid = joiValidationPipe.transform({ mapName: 'fake name' }, null);
    } catch (error) {
      expect((error as BadRequestException).message.message).toBe('Validation failed');
    }
  });
});
