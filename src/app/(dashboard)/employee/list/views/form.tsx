'use client'
import { Input } from '@/components/ui/input'
import React, { startTransition, useActionState, useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { PlusIcon, CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Autocomplete } from '@/components/ui/autocomplete'
import { Controller, useForm } from 'react-hook-form'
import RequiredLabel from '@/components/ui/required-label'
import { Department, Designation, Employee, WorkLocation } from '@prisma/client'
import { DrawerClose, DrawerFooter } from '@/components/ui/drawer'
import { saveEmployee, updateEmployee } from './action'
import { toast } from 'sonner'
import SubmitButton from '@/components/ui/submit-button'
import { EmployeeFormValues, EmployeeSchema, EmployeeWithRelations } from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod'

type Props = {
  departments?: Department[]
  designations?: Designation[]
  workLocations?: WorkLocation[]
  showForm: boolean
  employee: Employee | null
  toggleForm: () => void
}

const Form = ({ departments, designations, workLocations, showForm, employee, toggleForm }: Props) => {
  const [saveState, saveAction, isSavePending] = useActionState(saveEmployee, undefined)
  const [updateState, updateAction, isUpdatePending] = useActionState(updateEmployee, undefined)

  const state = saveState || updateState
  const isPending = isSavePending || isUpdatePending

  const defaultValues: Partial<EmployeeFormValues> = {
    id: employee?.id ?? '',
    name: employee?.name ?? '',
    dateOfBirth: employee?.dateOfBirth ?? format(new Date(), 'yyyy-MM-dd'),
    gender: employee?.gender ?? 'male',
    email: employee?.email ?? '',
    designation: employee?.designation ?? '',
    department: employee?.department ?? '',
    employmentType: employee?.employmentType ?? 'PERMANENT',
    dateOfJoining: employee?.dateOfJoining ?? format(new Date(), 'yyyy-MM-dd'),
    workLocation: employee?.workLocation ?? ''
  }

  const {
    control,
    reset,
    handleSubmit,
    watch,
    formState: { isValid }
  } = useForm<EmployeeFormValues>({
    mode: 'onChange',
    defaultValues,
    resolver: zodResolver(EmployeeSchema)
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
    if (showForm) 
    reset(defaultValues)
  }, [showForm])

  const onSubmit = (data: EmployeeFormValues) => {
    const formData = new FormData()

    Object.keys(data).forEach(key => {
      formData.append(key, data[key as keyof typeof data].toString())
    })

    if (employee?.id) {
      startTransition(() => updateAction(formData))
    } else {
      startTransition(() => saveAction(formData))
    }
  }

  return (
    <Dialog open={showForm} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button className='max-w-fit' onClick={onClose}>
          <PlusIcon className='mr-2' />
          Create Employee
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:min-w-[50%]'>
        <DialogHeader>
          <DialogTitle>Create Employee</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='w-full space-y-6'>
          <div className='space-y-4'>
            {/* Personal Info */}
            <Label className='text-lg'>Personal Info</Label>
            <div className='flex flex-col gap-4'>
              <div className='flex gap-4'>
                <div className='grid w-full gap-1.5'>
                  <RequiredLabel htmlFor='firstName'>Full Name</RequiredLabel>
                  <Controller
                    name='name'
                    control={control}
                    render={({ field }) => <Input {...field} id='name' placeholder='John Doe' />}
                  />
                </div>
              </div>

              <div className='flex gap-4'>
                <div className='grid w-1/2 gap-1.5'>
                  <RequiredLabel htmlFor='dateOfBirth'>Date of Birth</RequiredLabel>
                  <Controller
                    name='dateOfBirth'
                    control={control}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant='outline'
                            className={cn(
                              'h-10 w-full justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className='mr-2 h-4 w-4' />
                            {field.value ? format(new Date(field.value), 'PPP') : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0'>
                          <Calendar
                            mode='single'
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={selected => {
                              if (selected) {
                                const formatted = format(selected, 'yyyy-MM-dd')
                                field.onChange(formatted)
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                </div>

                <div className='grid w-1/2 gap-1.5'>
                  <RequiredLabel htmlFor='gender'>Gender</RequiredLabel>
                  <Controller
                    name='gender'
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className='h-10'>
                          <SelectValue placeholder='Select gender' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='male'>Male</SelectItem>
                          <SelectItem value='female'>Female</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className='flex gap-4'>
                <div className='grid w-1/2 gap-1.5'>
                  <RequiredLabel htmlFor='email'>Email</RequiredLabel>
                  <Controller
                    name='email'
                    control={control}
                    render={({ field }) => <Input {...field} id='email' placeholder='john@example.com' />}
                  />
                </div>
                <div className='w-1/2'></div>
              </div>
            </div>

            {/* Job Details */}
            <Label className='text-lg'>Job Details</Label>
            <div className='flex flex-col gap-4'>
              <div className='flex gap-4'>
                <div className='grid w-1/2 gap-1.5'>
                  <RequiredLabel htmlFor='designation'>Designation</RequiredLabel>
                  <Controller
                    name='designation'
                    control={control}
                    render={({ field }) => (
                      <Autocomplete {...field} list={designations ?? []} placeholder='Select designation' />
                    )}
                  />
                </div>
                <div className='grid w-1/2 gap-1.5'>
                  <RequiredLabel htmlFor='department'>Department</RequiredLabel>
                  <Controller
                    name='department'
                    control={control}
                    render={({ field }) => (
                      <Autocomplete {...field} list={departments ?? []} placeholder='Select department' />
                    )}
                  />
                </div>
              </div>

              <div className='flex gap-4'>
                <div className='grid w-1/2 gap-1.5'>
                  <RequiredLabel htmlFor='employmentType'>Employment Type</RequiredLabel>
                  <Controller
                    name='employmentType'
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className='h-10'>
                          <SelectValue placeholder='Select type' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='PERMANENT'>Permanent</SelectItem>
                          <SelectItem value='CONTRACT'>Contract</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className='grid w-1/2 gap-1.5'>
                  <RequiredLabel htmlFor='dateOfJoining'>Date of Joining</RequiredLabel>
                  <Controller
                    name='dateOfJoining'
                    control={control}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant='outline'
                            className={cn(
                              'h-10 w-full justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className='mr-2 h-4 w-4' />
                            {field.value ? format(new Date(field.value), 'PPP') : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0'>
                          <Calendar
                            mode='single'
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={selected => {
                              if (selected) {
                                const formatted = format(selected, 'yyyy-MM-dd')
                                field.onChange(formatted)
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                </div>
              </div>

              <div className='flex gap-4'>
                <div className='grid w-1/2 gap-1.5'>
                  <RequiredLabel htmlFor='workLocation'>Work Location</RequiredLabel>
                  <Controller
                    name='workLocation'
                    control={control}
                    render={({ field }) => (
                      <Autocomplete {...field} list={workLocations ?? []} placeholder='Select work location' />
                    )}
                  />
                </div>
                <div className='w-1/2'></div>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <div className='flex justify-between'>
              <DrawerClose asChild>
                <Button variant='outline' onClick={onClose}>
                  Cancel
                </Button>
              </DrawerClose>
              <SubmitButton isLoading={isPending} isValid={isValid} type='submit'>
                Save
              </SubmitButton>
            </div>
          </DrawerFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default Form
