'use client'
import { Input } from '@/components/ui/input'
import React, { startTransition, useActionState, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

import { Controller, useForm } from 'react-hook-form'
import RequiredLabel from '@/components/ui/required-label'
import { Loader, PlusIcon } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { BusinessFormValues, BusinessSchema, DesignationFormValues, designationSchema,  } from '@/lib/types'
import { toast } from 'sonner'
import { saveBusiness } from './action'
import { updateDesignation } from '@/app/(dashboard)/settings/views/tabs/designation/action'
import { useUser } from '@/components/user-provider'


const AddBusiness = () => {
  const [saveState, saveAction, isSavePending] = useActionState(saveBusiness, undefined)
  const [showForm, setShowForm] = useState(false)

  const toggleForm = () => {
    setShowForm(!showForm)
  }

  const state = saveState 
  const isPending = isSavePending 
  const {user} = useUser()

  const defaultValues:BusinessFormValues = {
    name:'',
    ownerId:user?.userId || '',
    subdomain:''
  }

  const {
    control,
    reset,
    formState: { isValid },
    handleSubmit
  } = useForm<BusinessFormValues>({
    defaultValues,
    resolver: zodResolver(BusinessSchema),
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
  }, [ saveState])

  useEffect(() => {
    if (showForm) reset(defaultValues)
  }, [showForm])

  const onSubmit = (data: BusinessFormValues) => {
    const formData = new FormData()

    Object.keys(data).forEach(key => {
      formData.append(key, data[key as keyof typeof data].toString())
    })


    startTransition(() => saveAction(formData))
  }

  return (
    <Dialog open={showForm} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button className='max-w-fit' onClick={onClose}>
           <PlusIcon className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
          Create Business
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create Business</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='flex gap-4'>
            <div className='grid w-1/2 items-center gap-1.5'>
              <RequiredLabel htmlFor='name'>Business Name</RequiredLabel>
              <Controller
                name='name'
                control={control}
                render={({ field }) => <Input {...field} id='name' placeholder='Horizontal Pvt Ltd' />}
              />
            </div>
            <div className='grid w-1/2 items-center gap-1.5'>
              <RequiredLabel htmlFor='subdomain'>Subdomain</RequiredLabel>
              <Controller
                name='subdomain'
                control={control}
                render={({ field }) => <Input {...field} onChange={(e) => field.onChange(e.target.value.toLowerCase())} id='subdomain' placeholder='horizontal' />}
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

export default AddBusiness
