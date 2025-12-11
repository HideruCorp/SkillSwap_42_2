import * as yup from 'yup';
/* import type { OptionType } from '@shared/ui/dropdown-list/index'; */

export const ThirdStepValidationSchema = yup.object({
  skillName: yup
    .string()
    .min(3, 'Название навыка должно быть более 3 символов')
    .max(50, 'Название навыка должно быть менее 50 символов')
    .required('Заполните название навыка'),
  category: yup
    .array()
    .of(
      yup.object().shape({
        title: yup.string().required(),
        value: yup.string().required(),
      })
    )
    .min(1, 'Выберите категорию навыка')
    .required('Выберите категорию навыка'),
  subcategory: yup
    .array()
    .of(
      yup.object().shape({
        title: yup.string().required(),
        value: yup.string().required(),
      })
    )
    .min(1, 'Выберите подкатегорию навыка')
    .required('Выберите подкатегорию навыка'),
  description: yup
    .string()
    .min(10, 'Описание должно содержать минимум 10 символов')
    .max(300, 'Описание не должно превышать 300 символов')
    .required('Заполните описание навыка'),
  images: yup
    .array()
    .of(yup.mixed<File>().required())
    .min(1, 'Загрузите хотя бы одно изображение')
    .max(5, 'Максимум 5 изображений')
    .required('Загрузите изображения навыка'),
});

export default ThirdStepValidationSchema;
