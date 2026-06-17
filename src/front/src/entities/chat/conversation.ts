import { wsURL } from "@/api";
import Message from "./message";

export interface IConversation {
    name: string;
    sender?: {
        id: string;
        name?: string;
        avatar?: string;
    };
    receiver?: {
        id: string;
        name?: string;
        avatar?: string;
    };
    // For backward compatibility with existing code
    participants?: Array<{
        id: string;
        name?: string;
        avatar?: string;
    }>;
    messages?: Message[];
    lastMessage?: Message | null;
    unreadCount?: number;
}

export default class Conversation {
    private _name: string;
    private _unreadCount: number = 0;
    private _sender: {
        id: string;
        name: string;
        avatar: string;
    };
    private _receiver: {
        id: string;
        name: string;
        avatar: string;
    };
    private _messages: Message[];
    private _messagesLoaded: boolean = false;
    private _socket: WebSocket | null;
    private _lastMessage: Message | null = null;

    constructor(data: IConversation) {
        this._name = data.name;
        
        // Handle participants array format (backward compatibility)
        if (data.participants && data.participants.length >= 2) {
            this._sender = {
                id: data.participants[0].id,
                name: data.participants[0].name || 'User',
                avatar: data.participants[0].avatar || ''
            };
            this._receiver = {
                id: data.participants[1].id,
                name: data.participants[1].name || 'Tenant',
                avatar: data.participants[1].avatar || ''
            };
        } else {
            // Use sender/receiver format
            this._sender = {
                id: data.sender?.id || 'current-user',
                name: data.sender?.name || 'User',
                avatar: data.sender?.avatar || ''
            };
            this._receiver = {
                id: data.receiver?.id || '',
                name: data.receiver?.name || 'Tenant',
                avatar: data.receiver?.avatar || ''
            };
        }
        
        this._unreadCount = data.unreadCount || 0;
        this._messages = data.messages || [];
        this._messagesLoaded = this._messages.length > 0;
        // Initialize lastMessage: Use provided value or compute from messages
        this._lastMessage = data.lastMessage || (this._messages.length > 0 ? this._messages[this._messages.length - 1] : null);


        try {
            this._socket = new WebSocket(wsURL + this._name + "/");
        } catch (error) {
            console.error("WebSocket connection failed:", error);
            this._socket = null;
        }
    }

    // Static factory method for creating from tenant data
    static createFromTenant(tenantData: any, currentUserId: string = 'current-user'): Conversation {
        return new Conversation({
            name: `tenant-${tenantData.id}`,
            sender: {
                id: currentUserId,
                name: 'You',
                avatar: ''
            },
            receiver: {
                id: tenantData.id,
                name: tenantData.name || 'Tenant',
                // Handle different property names for profile picture
                avatar: tenantData.profilePicture || tenantData.profile_picture || ''
            },
            messages: []
        });
    }

    // Method to check if this conversation is with a specific tenant
    isWithTenant(tenantId: string): boolean {
        return this._receiver.id === tenantId || this.sender.id === tenantId;
    }

    get name() {
        return this._name;
    }

    get sender() {
        return this._sender;
    }
    
    get unreadCount() {
        return this._unreadCount;
    }

    set unreadCount(count: number) {
        this._unreadCount = count;
    }

    get receiver() {
        return this._receiver;
    }

    get messages() {
        return this._messages;
    }

    get messagesLoaded() {
        return this._messagesLoaded;
    }

    get socket() {
        return this._socket;
    }

    get lastMessage() {
        return this._lastMessage;
    }

     set lastMessage(message: Message | null) {
        this._lastMessage = message;
    }



    // Setters
set socket(newSocket: WebSocket | null) {
    this._socket = newSocket;
}
    set messages(messages: Message[]) {
        this._messages = messages;
        this._messagesLoaded = true;
    }

    // Methods
    addMessage(message: Message) {
        this._messages.push(message);
          this._lastMessage = message; 
    }

    // Unread messages handling
    incrementUnreadCount() {
        this._unreadCount += 1;
    }

    resetUnreadCount() {
        this._unreadCount = 0;
    }

    hasUnreadMessages() {
        return this._unreadCount > 0;
    }
}