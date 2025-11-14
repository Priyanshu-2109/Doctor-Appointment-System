import React from 'react'

const ChatIframe = () => {
  return (
    <div className='w-full min-h-[80vh]'>
      <iframe
        title='AI Chat'
        src='https://agency-zaumon.chat-dash.com/iframe/690c8711ad933ffbec604352'
        style={{ width: '100%', height: '80vh', border: '0' }}
        allow='microphone'
      />
    </div>
  )
}

export default ChatIframe
