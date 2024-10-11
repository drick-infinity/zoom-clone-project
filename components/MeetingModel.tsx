import React,{ReactNode} from 'react'
import Image from "next/image";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
  
interface MeetingModelProps{
    isOpen:boolean;
    title:string;
    onClose:() => void;
    className?:string;
    children?:ReactNode;
    handleClick?:()=>void;
    instantMeeting?:boolean;
    buttonText?:string;
    image?:string;
    buttonClassName?:string;
    buttonIcon?:string;
}

const MeetingModel = ({isOpen, onClose,title,className,children,handleClick, buttonText="Schedule Meeting", image, buttonIcon} : MeetingModelProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogTrigger asChild>Open</DialogTrigger>
    <DialogContent className="flex w-full max-w-[520px] flex-col gap-6 border-none bg-dark-1 px-6 py-9 text-white">
    <div className='flex flex-col gap-6'>
    {image && (
        <div className='flex justify-center'>
            <Image src={image} alt="checked"  width={100} height={100} />
        </div>
    )}
    <h1 className={cn('text-3xl font-bold leading-[42px]',className)}>{title}</h1>
    {children}
    <Button className="bg-blue-1 focus-visible:ring-0 focus-visible:ring-offset-0" onClick={handleClick}>
      {buttonIcon && (<Image src={buttonIcon} alt='button icon' width={24} height={24}/>)}
      {" "}
      &nbsp;
{buttonText || 'Schedule Meeting'}
    </Button>
    </div>
    </DialogContent>
  </Dialog> 
  
  )
}

export default MeetingModel