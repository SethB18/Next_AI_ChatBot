import React from 'react';
import ChatHead from '@/component/chat/ai_agent';
import ChatWidget from '@/component/chat/back_up';
import MyBtn from '@/component/chat/myBtn';
import Date_TimePicker from '@/component/date/datetime_picker';
export default function Agent() {
  return <div>
    <Date_TimePicker />
    <ChatWidget />
  </div>;
}   