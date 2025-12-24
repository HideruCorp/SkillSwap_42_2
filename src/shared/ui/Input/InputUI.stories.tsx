// InputUI.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import InputUI from './InputUI'

const meta = {
  title: 'UI/Input',
  component: InputUI,
} satisfies Meta<typeof InputUI>

export default meta

export const Basic: StoryObj<typeof InputUI> = {
  render: function Render() {
    const [value, setValue] = useState('')
    return <InputUI value={value} onChange={setValue} placeholder="Введите что-нибудь..." />
  },
}

export const WithError: StoryObj<typeof InputUI> = {
  render: function Render() {
    const [value, setValue] = useState('')
    const error = value.length > 0 && value.length < 3 ? 'Минимум 3 символа' : undefined

    return (
      <InputUI
        value={value}
        onChange={setValue}
        placeholder="Введите минимум 3 символа"
        error={error}
      />
    )
  },
}

export const Password: StoryObj<typeof InputUI> = {
  render: function Render() {
    const [value, setValue] = useState('')
    return (
      <InputUI
        value={value}
        onChange={setValue}
        placeholder="Введите пароль"
        type="password"
        message="Надежный"
      />
    )
  },
}

export const Edit: StoryObj<typeof InputUI> = {
  render: function Render() {
    const [value, setValue] = useState('Мария')
    return <InputUI value={value} onChange={setValue} placeholder="Введите имя" type="change" />
  },
}
