import ConversacionList from "../../components/chat/ConversacionList";
import ChatWindow from "../../components/chat/ChatWindow";

export default function ChatPage(){

    return(
        <div className="flex -my-6 -mx-5 h-[calc(100vh-4rem)] lg:h-screen overflow-hidden" style={{borderLeft: '1px solid var(--color-border)', borderRight: '1px solid var(--color-border)'}}>
            <ConversacionList />
            <ChatWindow />
        </div>
    )
}