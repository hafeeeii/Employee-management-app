'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { startTransition, useActionState, useEffect } from 'react'

import LoadingButton from '@/components/ui/buttons/loading-button'
import { Label } from '@/components/ui/label'
import RequiredLabel from '@/components/ui/required-label'
import { Textarea } from '@/components/ui/textarea'
import { DepartmentFormValues, departmentSchema } from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Department } from '@prisma/client'
import { PlusIcon, Save } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { saveDepartment, updateDepartment } from './action'

type FormProps = {
  department?: Department | null
  showForm: boolean
  toggleForm: () => void
}

const Form = ({ department, showForm, toggleForm }: FormProps) => {
  const [saveState, saveAction, isSavePending] = useActionState(saveDepartment, undefined)
  const [updateState, updateAction, isUpdatePending] = useActionState(updateDepartment, undefined)

  const state = saveState || updateState
  const isPending = isSavePending || isUpdatePending

  const defaultValues = {
    id: department?.id || '',
    name: department?.name || '',
    code: department?.code || '',
    description: department?.description || ''
  }

  const {
    control,
    reset,
    formState: { isValid },
    handleSubmit
  } = useForm<DepartmentFormValues>({
    defaultValues,
    resolver: zodResolver(departmentSchema),
    mode: 'onChange'
  })

  const onClose = () => {
    toggleForm()
    reset()
  }

  useEffect(() => {
    if (state?.status) {
      onClose()
    }

    if (state?.message) {
      if (state.status) {
        toast.success(state.message)
      } else {
        toast.error(state.message)
      }
    }
  }, [updateState, saveState])

  useEffect(() => {
    if (showForm) reset(defaultValues)
  }, [showForm])

  const onSubmit = (data: DepartmentFormValues) => {
    const formData = new FormData()

    Object.keys(data).forEach(key => {
      formData.append(key, data[key as keyof typeof data].toString())
    })

    if (department?.id) {
      startTransition(() => updateAction(formData))
    } else {
      startTransition(() => saveAction(formData))
    }
  }

  return (
    <Dialog open={showForm} onOpenChange={toggleForm}>
      <DialogTrigger asChild>
        <Button className='max-w-fit' onClick={toggleForm}>
          <PlusIcon />
          Create Department
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:min-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Create Department</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='flex gap-4'>
            <div className='grid w-1/2 items-center gap-1.5'>
              <RequiredLabel htmlFor='name'>Department Name</RequiredLabel>
              <Controller
                name='name'
                control={control}
                render={({ field }) => <Input {...field} id='name' placeholder='Engineering' />}
              />
            </div>
            <div className='grid w-1/2 items-center gap-1.5'>
              <Label htmlFor='code'>Department Code</Label>
              <Controller
                name='code'
                control={control}
                render={({ field }) => <Input {...field} id='code' placeholder='ENG001' />}
              />
            </div>
          </div>
          <div className='flex gap-4'>
            <div className='grid h-full w-full items-center gap-1.5'>
              <Label htmlFor='description'>Description</Label>
              <Controller
                name='description'
                control={control}
                render={({ field }) => (
                  <Textarea {...field} id='description' placeholder='Brief description about this department' />
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <LoadingButton type='submit' disabled={!isValid} isLoading={isPending} icon={<Save />}>
              Save
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default Form
