'use client'
import { Input } from '@/components/ui/input'
import React, { startTransition, useActionState, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import { Controller, useForm } from 'react-hook-form'
import RequiredLabel from '@/components/ui/required-label'
import { Loader, PlusIcon } from 'lucide-react'
import { saveDesignation, updateDesignation } from './action'
import { zodResolver } from '@hookform/resolvers/zod'
import { DesignationFormValues, designationSchema } from '@/lib/types'
import { toast } from 'sonner'
import { Designation } from '@prisma/client'

type FormProps = {
  designation?: Designation | null
  showForm: boolean
  toggleForm: () => void
}

const Form = ({ designation, showForm, toggleForm }: FormProps) => {
  const [saveState, saveAction, isSavePending] = useActionState(saveDesignation, undefined)
  const [updateState, updateAction, isUpdatePending] = useActionState(updateDesignation, undefined)

  const state = saveState || updateState
  const isPending = isSavePending || isUpdatePending

  const defaultValues = {
    id: designation?.id || '',
    name: designation?.name || ''
  }

  const {
    control,
    reset,
    formState: { isValid },
    handleSubmit
  } = useForm<DesignationFormValues>({
    defaultValues,
    resolver: zodResolver(designationSchema),
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
      toast.success(state.message)
    }
  }, [updateState, saveState])

  useEffect(() => {
    if (showForm) reset(defaultValues)
  }, [showForm])

  const onSubmit = (data: DesignationFormValues) => {
    const formData = new FormData()

    Object.keys(data).forEach(key => {
      formData.append(key, data[key as keyof typeof data].toString())
    })

    if (designation?.id) {
      startTransition(() => updateAction(formData))
    } else {
      startTransition(() => saveAction(formData))
    }
  }

  return (
    <Dialog open={showForm} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button className='max-w-fit' onClick={onClose}>
          <PlusIcon />
          Create Designation
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create Designation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='flex gap-4'>
            <div className='grid w-full items-center gap-1.5'>
              <RequiredLabel htmlFor='name'>Designation Name</RequiredLabel>
              <Controller
                name='name'
                control={control}
                render={({ field }) => <Input {...field} id='name' placeholder='Software Engineer' />}
              />
            </div>
          </div>
          <DialogFooter>
            <Button disabled={!isValid || isPending} type='submit'>
              {isPending && <Loader className='mr-2 h-4 w-4 animate-spin' />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default Form
