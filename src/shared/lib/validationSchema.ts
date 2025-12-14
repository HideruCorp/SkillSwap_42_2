import * as yup from 'yup';

// ============ CREDENTIALS (Step 1) ============

export const CredentialsValidationSchema = yup.object({
  email: yup.string().email('Некорректный формат email').required('Заполните email'),
  password: yup
    .string()
    .min(8, 'Пароль должен содержать не менее 8 знаков')
    .required('Заполните пароль'),
});

export const getPasswordStrength = (password: string) => {
  if (!password) return { score: 0, maxScore: 6, label: '' };

  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

  const levels = [
    { min: 0, label: 'Очень слабый' },
    { min: 2, label: 'Слабый' },
    { min: 3, label: 'Средний' },
    { min: 5, label: 'Надёжный' },
    { min: 6, label: 'Отличный' },
  ];

  const level = [...levels].reverse().find((l) => score >= l.min);

  return { score, maxScore: 6, label: level?.label || '' };
};

// ============ SKILL DATA (Step 3) ============

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
    .of(
      yup
        .object()
        .shape({
          file: yup.mixed<File>().required(),
          id: yup.string().required(),
          name: yup.string().required(),
          preview: yup.string(),
        })
        .required()
    )
    .min(1, 'Загрузите хотя бы одно изображение')
    .max(5, 'Максимум 5 изображений')
    .required('Загрузите изображения навыка'),
});

export default ThirdStepValidationSchema;
