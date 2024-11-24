// @ts-nocheck
"use client";
import { useState, useEffect } from 'react';
import MeetingTypeList from '@/components/MeetingTypeList';
import { useGetCalls } from '@/hooks/useGetCalls'; // Ensure you have this hook to get call data

const Home = () => {
  const [upcomingMeetingTime, setUpcomingMeetingTime] = useState('');
  const { upcomingCalls, isLoading } = useGetCalls(); // Fetch upcoming calls directly

  // Function to fetch the next upcoming meeting time
  const fetchNextUpcomingMeetingTime = () => {
    if (upcomingCalls && upcomingCalls.length > 0) {
      const futureMeetings = upcomingCalls.filter(meeting => {
        const startsAt = new Date(meeting.state?.startsAt);
        return startsAt > new Date(); // Only keep meetings that start in the future
      });

      if (futureMeetings.length > 0) {
        const firstUpcomingMeeting = futureMeetings[0];
        const startsAt = firstUpcomingMeeting.state?.startsAt;

      if (startsAt) {
        const formattedMeetingTime = new Date(startsAt).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });
        setUpcomingMeetingTime(formattedMeetingTime);}
      } else {
        setUpcomingMeetingTime('No Upcoming Meetings');
      }
    } else {
      setUpcomingMeetingTime('No Upcoming Meetings');
    }
  };

  // Use effect to fetch upcoming meeting time when the component mounts or when upcomingCalls changes
  useEffect(() => {
    fetchNextUpcomingMeetingTime();
  }, [upcomingCalls]); // Re-fetch when upcomingCalls change

  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const date = new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(now);

  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      <div className='mt-[80px] h-[300px] w-full rounded-[20px] bg-hero bg-cover'>
        <div className='flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11'>
          {isLoading ? ( // Show loading state if data is being fetched
            <h2 className='glassmorphism max-w-[270px] rounded py-2 text-center text-base font-normal'>
              Loading Upcoming Meeting...
            </h2>
          ) : upcomingMeetingTime ? ( // Show upcoming meeting time if available
            <h2 className='glassmorphism max-w-[270px] rounded py-2 text-center text-base font-normal'>
              Upcoming Meeting at {upcomingMeetingTime}
            </h2>
          ) : ( // Show message if no upcoming meetings are available
            <h2 className='glassmorphism max-w-[270px] rounded py-2 text-center text-base font-normal'>
              No Upcoming Meetings
            </h2>
          )}
          <div className='flex flex-col gap-2'>
            <h1 className='text-3xl font-extrabold lg:text-6xl'>
              {time}
            </h1>
            <p className='text-lg font-medium text-sky-1 lg:text-2xl'>{date}</p>
          </div>
        </div>
      </div>
      <MeetingTypeList />
    </section>
  );
};

export default Home;
