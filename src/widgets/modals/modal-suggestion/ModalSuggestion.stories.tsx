// ModalSuggestion.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import ModalSuggestion from './ModalSuggestion'

const meta: Meta<typeof ModalSuggestion> = {
  title: 'Widgets/ModalSuggestion',
  component: ModalSuggestion,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof ModalSuggestion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Игра на барабанах',
    categories: 'Творчество и искусство',
    subcategories: 'Музыка и звук',
    description:
      'Привет! Я играю на барабанах уже больше 10 лет           —от репетиций в гараже до выступлений на сцене с живыми группами. Научу основам техники (и как не отбить себе пальцы), играть любимые ритмы и разбирать песни, импровизировать и звучать уверенно даже без паритуры',
    images: [
      'https://i.pinimg.com/736x/7d/be/d9/7dbed90655c6d7de0f4d01eb01b9cbe1.jpg',
      'https://i.pinimg.com/736x/7d/be/d9/7dbed90655c6d7de0f4d01eb01b9cbe1.jpg',
      'https://i.pinimg.com/736x/7d/be/d9/7dbed90655c6d7de0f4d01eb01b9cbe1.jpg',
      'https://i.pinimg.com/736x/7d/be/d9/7dbed90655c6d7de0f4d01eb01b9cbe1.jpg',
    ],
    onEdit: () => console.log('Edit clicked'),
    onDone: () => console.log('Done clicked'),
  },
}
