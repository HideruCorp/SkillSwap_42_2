import type { Meta, StoryObj } from '@storybook/react'
import { ProgressBar } from './ProgressBar'

const meta: Meta<typeof ProgressBar> = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'center',
  },
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof ProgressBar>

export const Default: Story = {
  render: () => <ProgressBar currentStep={2} totalSteps={5} />,
}

export const Full: Story = {
  render: () => <ProgressBar currentStep={5} totalSteps={5} />,
}

export const Start: Story = {
  render: () => <ProgressBar currentStep={1} totalSteps={5} />,
}

export const Middle: Story = {
  render: () => <ProgressBar currentStep={3} totalSteps={5} />,
}
