import { useDispatch } from '@app/store'
import { resetRegistration, useRegistrationWizard } from '@features/auth'
import Modal from '@features/modal/Modal'
import lightBulb from '@shared/assets/img/light-Bulb.svg'
import schoolBoard from '@shared/assets/img/school-Board.svg'
import userInfo from '@shared/assets/img/user-Info.svg'
import ComponentWithImg from '@widgets/componentWithImg/ComponentWithImg'
import ModalSuggestion from '@widgets/modals/modal-suggestion/ModalSuggestion'
import ProgressBar from '@widgets/progress-bar/ProgressBar'
import RegisterLayout from '@widgets/registerLayout/RegisterLayout'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './authorize-page.module.scss'

import { CredentialsStep, SkillDataStep, UserDataStep } from './steps'

const imgAndText = [
  {
    img: lightBulb,
    title: 'Добро пожаловать в SkillSwap!',
    text: 'Войдите или зарегистрируйтесь, чтобы обмениваться знаниями и навыками',
  },
  {
    img: userInfo,
    title: 'Расскажите немного о себе',
    text: 'Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена',
  },
  {
    img: schoolBoard,
    title: 'Укажите, чем вы готовы поделиться',
    text: 'Так другие люди смогут увидеть ваши предложения и предложить вам обмен!',
  },
]

function AuthorizePage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isOpenModal, setIsOpenModal] = useState(false)

  // Оркестратор регистрации
  const { currentStep, submitRegistration } = useRegistrationWizard()

  // Очистка состояния регистрации при размонтировании
  useEffect(() => {
    return () => {
      dispatch(resetRegistration())
    }
  }, [dispatch])

  const handleRegistretionSubmitSuccess = useCallback(async () => {
    const result = await submitRegistration()
    if (result.success && result.skillId) {
      navigate(`/skills/${result.skillId}?registerSuccess=true`)
    }
  }, [submitRegistration, navigate])

  const renderStep = () => {
    switch (currentStep) {
      case 2:
        return <UserDataStep />
      case 3:
        return <SkillDataStep onStepCompleted={() => setIsOpenModal(true)} />
      default:
        return <CredentialsStep onLoginSuccess={() => navigate('/')} />
    }
  }

  return (
    <>
      <section className={styles.authorize}>
        <RegisterLayout
          header={<ProgressBar currentStep={currentStep} totalSteps={3} />}
          leftPart={renderStep()}
          rightPart={(
            <ComponentWithImg
              img={imgAndText[currentStep - 1].img}
              title={imgAndText[currentStep - 1].title}
              text={imgAndText[currentStep - 1].text}
            />
          )}
        />
      </section>

      {isOpenModal && (
        <Modal className={styles.suggestion} onClose={() => setIsOpenModal(false)}>
          <ModalSuggestion
            submit={handleRegistretionSubmitSuccess}
            onClose={() => setIsOpenModal(false)}
          />
        </Modal>
      )}
    </>
  )
}

export default AuthorizePage
