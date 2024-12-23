"use client"

import { useState } from "react";
import HomeCard from "./HomeCard";
import MeetingModel from "./MeetingModel";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Textarea } from "@/components/ui/textarea";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import ReactDatePicker from 'react-datepicker';
import { Input } from "@/components/ui/input";

const MeetingTypeList = () => {
    const router = useRouter();
    const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>();
    const { user } = useUser(); // Get the current user
    const client = useStreamVideoClient();
    const [values, setValues] = useState({
        dateTime: new Date(),
        description: '',
        link: ''
    });
    const [callDetail, setCallDetail] = useState<Call>();
    const { toast } = useToast();

    const createMeeting = async () => {
        // Redirect to sign-in if user is not authenticated
        if (!client) {
            toast({ title: "Video client not available." });
            return;
        }

        if (!user) {
            toast({ title: "You must be signed in to create a meeting." });
            // Redirect to sign-in page (adjust this URL according to your routing)
            router.push('/sign-in');
            return;
        }

        try {
            if (!values.dateTime) {
                toast({ title: "Please select a date and time" });
                return;
            }

            const id = crypto.randomUUID();
            const call = client.call('default', id);

            if (!call) throw new Error('Failed to create call');

            const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
            const description = values.description || 'Instant meeting';

            await call.getOrCreate({
                data: {
                    starts_at: startsAt,
                    custom: {
                        description
                    }
                }
            });
            setCallDetail(call);

            // Redirect to meeting details page if a description is provided
            if (description) {
                router.push(`meeting/${call.id}`);
            } else {
                toast({ title: "Meeting Created" });
            }
        } catch (error) {
            console.error(error);
            toast({ title: "Failed to create meeting" });
        }
    };

    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetail?.id}`;

    return (
        <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
            <HomeCard 
                img='/icons/add-meeting.svg'
                title='New Meeting'
                description='Start an instant meeting'
                handleClick={() => setMeetingState('isInstantMeeting')}
                className='bg-orange-1'
            />  
            <HomeCard
                img='/icons/schedule.svg'
                title='Schedule Meeting'
                description='Plan your meeting'
                handleClick={() => setMeetingState('isScheduleMeeting')}
                className="bg-blue-1"
            />  
            <HomeCard
                img='/icons/recordings.svg'
                title='View Recordings'
                description='Check out your recordings'
                handleClick={() => router.push('/recordings')}
                className="bg-purple-1"
            />  
            <HomeCard 
                img='/icons/join-meeting.svg'
                title='Join Meeting'
                description='via invitation link'
                handleClick={() => setMeetingState('isJoiningMeeting')}
                className="bg-yellow-1"
            />  

            {/* Schedule Meeting Modal */}
            <MeetingModel
                isOpen={meetingState === 'isScheduleMeeting'}
                onClose={() => setMeetingState(undefined)}
                title="Schedule a Meeting"
                handleClick={createMeeting}
            >
                <div className="flex flex-col gap-2.5">
                    <label className="text-base text-normal leading-[22px] text-sky-2">Add a description</label>
                    <Textarea className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                        onChange={(e) => {
                            setValues({ ...values, description: e.target.value });
                        }}
                    />
                </div>
                <div className="flex w-full flex-col gap-2.5">
                    <label className="text-base text-normal leading-[22px] text-sky-2">Select Date and Time</label>
                    <ReactDatePicker
                        selected={values.dateTime}
                        onChange={(date: Date | null) => setValues({ ...values, dateTime: date! })}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="time"
                        dateFormat="MMM d, yyyy h:mm aa"
                        className="w-full rounded bg-dark-3 p-2 focus:outline-none"
                    />
                </div>
            </MeetingModel>

            {/* Meeting Created Modal */}
            {callDetail && (
                <MeetingModel 
                    isOpen={meetingState === 'isScheduleMeeting' && !values.description}
                    onClose={() => setMeetingState(undefined)}
                    title="Meeting Created"
                    handleClick={() => {
                        navigator.clipboard.writeText(meetingLink);
                        toast({ title: 'Link Copied' });
                    }}
                    image="/icons/checked.svg"
                    buttonIcon="/icons/copy.svg"
                    buttonText="Copy Meeting Link"
                />
            )}

            {/* Instant Meeting Modal */}
            <MeetingModel 
                isOpen={meetingState === 'isInstantMeeting'}
                onClose={() => setMeetingState(undefined)}
                title="Start an Instant Meeting"
                className="text-center"
                buttonText="Start Meeting"
                handleClick={createMeeting}
            />

            {/* Join Meeting Modal */}
            <MeetingModel 
                isOpen={meetingState === 'isJoiningMeeting'}
                onClose={() => setMeetingState(undefined)}
                title="Type the link here"
                className="text-center"
                buttonText="Join Meeting"
                handleClick={() => router.push(values.link)}
            >
                <Input
                    placeholder="Meeting Link"
                    className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                    onChange={(e) => setValues({ ...values, link: e.target.value })}
                />
            </MeetingModel>
        </section>
    );
};

export default MeetingTypeList;











// "use client"

// import { useState } from "react";
// import HomeCard from "./HomeCard";
// import MeetingModel from "./MeetingModel";
// import { useToast } from "@/hooks/use-toast";
// import { useRouter } from "next/navigation";
// import { useUser } from "@clerk/nextjs";
// import { Textarea } from "@/components/ui/textarea"
// import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
// import ReactDatePicker from 'react-datepicker';
// import { Input } from "@/components/ui/input"

// const MeetingTypeList = () => {
// const router = useRouter();

// const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()
// const {user} = useUser();
// const client = useStreamVideoClient();
// const [values, setValues] = useState({
//   dateTime: new Date(),
//   description:'',
//   link:''
// })

// const [callDetail, setCallDetail] = useState<Call>();
// const {toast} = useToast();
// const createMeeting = async() => {
//   if(!client || !user) {
//     toast({ title: "You must be signed in to create a meeting." });
//     return
//   }
//   try{

//     if(!values.dateTime){
//       toast({title:"Please select a date and time"})
//         return;
//     }

//     const id = crypto.randomUUID();
//     const call = client.call('default',id);

//     if(!call) throw new Error('Failed to create call')
//       const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
//       const description = values.description || 'Instant meeting';

//       await call.getOrCreate({
//         data:{
//           starts_at: startsAt,
//           custom:{
//             description
//           }
//         }
//       })
//       setCallDetail(call);

//       if(!values.description){
//         router.push(`meeting/${call.id}`)
//       }
// toast({title:"Meeting Created"})
//       }catch(error){
//     console.log(error);
//     toast({
//       title:"Failed to create meeting",
//     })
//   }
// }

// const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetail?.id}`

//   return (
//     <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
//       <HomeCard 
//       img='/icons/add-meeting.svg'
//       title='New Meeting'
//       description='Start an instant meeting'
//       handleClick={()=>setMeetingState('isInstantMeeting')}
//       className='bg-orange-1'
//       />  
//       <HomeCard
//       img='/icons/schedule.svg'
//       title='Schedule Meeting'
//       description='Plan your meeting'
//       handleClick={()=>setMeetingState('isScheduleMeeting')}
//       className="bg-blue-1"
//       />  
//       <HomeCard
//       img='/icons/recordings.svg'
//       title='View Recordings'
//       description='Check out your recordings'
//       handleClick={()=>router.push('/recordings')}
//       className="bg-purple-1"/>  
//       <HomeCard 
//       img='/icons/join-meeting.svg'
//       title='Join Meeting'
//       description='via invitation link'
//       handleClick={()=> setMeetingState('isJoiningMeeting')}
//       className="bg-yellow-1"
//       />  
//       {!callDetail? (
//         <MeetingModel
//         isOpen={meetingState === 'isScheduleMeeting'}
//         onClose={() => setMeetingState(undefined)}
//         title="Start an Instant Meeting"
//         handleClick={createMeeting}
//         >
//          <div className="flex flex-col gap-2.5">
//             <label className="text-base text-normal leading-[22px] text-sky-2">Add a description</label>
//           <Textarea className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
//           onChange={(e)=>{
//             setValues({...values, description:e.target.value})
//           }}/>
//           </div>
//           <div className="flex w-full flex-col gap-2.5">
//           <label className="text-base text-normal leading-[22px] text-sky-2">Select Date and Time</label>
//           <ReactDatePicker
//           selected={values.dateTime}
//           onChange={(date: Date | null) => setValues({...values,
//             dateTime:date!
//           })}
//           showTimeSelect
//           timeFormat="HH:mm"
//           timeIntervals={15}
//           timeCaption="time"
//           dateFormat="MMM d, yyyy h:mm aa"
//           className="w-full rounded bg-dark-3 p-2 focus:outline-none"
//           />
//           </div>
//           </MeetingModel>
//       ):(
//         <MeetingModel 
//         isOpen={meetingState === 'isScheduleMeeting'}
//         onClose={() => setMeetingState(undefined)}
//         title="Meeting Created"
//         handleClick={()=>{
//           navigator.clipboard.writeText(meetingLink);
//           toast ({title:'Link Copied'})
//         }}
//         image="/icons/checked.svg"
//         buttonIcon="/icons/copy.svg"
//         buttonText="Copy Meeting Link"
//         />
//       )}
//       <MeetingModel 
//       isOpen={meetingState === 'isInstantMeeting'}
//       onClose={() => setMeetingState(undefined)}
//       title="Start an Instant Meeting"
//       className="text-center"
//       buttonText="Start Meeting"
//       handleClick={createMeeting}
//       />

// <MeetingModel 
//       isOpen={meetingState === 'isJoiningMeeting'}
//       onClose={() => setMeetingState(undefined)}
//       title="Type the link here"
//       className="text-center"
//       buttonText="Join Meeting"
//       handleClick={()=>router.push(values.link)}
//       >
//         <Input
//         placeholder="Meeting Link"
//         className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring=offset-0"
//         onChange={(e)=> setValues({...values, link:e.target.value})}
//         />
//       </MeetingModel>
//     </section>
//   )
// }

// export default MeetingTypeList