import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { RegistrationFormData } from '@/types';

interface RegistrationState {
  currentStep: number;
  applicationId: string | null;
  applicationNumber: string | null;
  sessionToken: string | null;
  formData: RegistrationFormData;
  isSubmitting: boolean;
  setCurrentStep: (step: number) => void;
  setApplicationId: (id: string) => void;
  setApplicationNumber: (num: string) => void;
  setSessionToken: (token: string) => void;
  updateStep1: (data: Partial<RegistrationFormData['step1']>) => void;
  updateStep2: (data: Partial<RegistrationFormData['step2']>) => void;
  updateStep3: (data: Partial<RegistrationFormData['step3']>) => void;
  updateStep4: (data: Partial<RegistrationFormData['step4']>) => void;
  updateStep5: (data: Partial<RegistrationFormData['step5']>) => void;
  updateStep6: (data: Partial<RegistrationFormData['step6']>) => void;
  setIsSubmitting: (val: boolean) => void;
  resetForm: () => void;
}

const initialFormData: RegistrationFormData = {
  step1: {},
  step2: { qualifications: [], experience: {} },
  step3: {},
  step4: { documents: [] },
  step5: {},
  step6: { agree: false, terms: false },
};

export const useRegistrationStore = create<RegistrationState>()(
  persist(
    (set) => ({
      currentStep: 1,
      applicationId: null,
      applicationNumber: null,
      sessionToken: null,
      formData: initialFormData,
      isSubmitting: false,
      setCurrentStep: (step) => set({ currentStep: step }),
      setApplicationId: (id) => set({ applicationId: id }),
      setApplicationNumber: (num) => set({ applicationNumber: num }),
      setSessionToken: (token) => set({ sessionToken: token }),
      updateStep1: (data) =>
        set((state) => ({ formData: { ...state.formData, step1: { ...state.formData.step1, ...data } } })),
      updateStep2: (data) =>
        set((state) => ({ formData: { ...state.formData, step2: { ...state.formData.step2, ...data } } })),
      updateStep3: (data) =>
        set((state) => ({ formData: { ...state.formData, step3: { ...state.formData.step3, ...data } } })),
      updateStep4: (data) =>
        set((state) => ({ formData: { ...state.formData, step4: { ...state.formData.step4, ...data } } })),
      updateStep5: (data) =>
        set((state) => ({ formData: { ...state.formData, step5: { ...state.formData.step5, ...data } } })),
      updateStep6: (data) =>
        set((state) => ({ formData: { ...state.formData, step6: { ...state.formData.step6, ...data } as RegistrationFormData['step6'] } })),
      setIsSubmitting: (val) => set({ isSubmitting: val }),
      resetForm: () =>
        set({
          currentStep: 1,
          applicationId: null,
          applicationNumber: null,
          sessionToken: null,
          formData: initialFormData,
          isSubmitting: false,
        }),
    }),
    { name: 'ztf-registration-store' }
  )
);
