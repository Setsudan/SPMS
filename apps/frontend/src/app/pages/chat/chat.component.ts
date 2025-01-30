import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message, MessagingService } from '../../services/messaging/messaging.service';
import { UserService } from '../../services/user/user.service';
import { User } from '../../models/types';
import { NgFor, NgIf } from '@angular/common';
import { ChatComponent } from '../../components/chat/chat.component';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  imports: [NgFor, NgIf, ChatComponent],
})
export class ChatPageComponent implements OnInit {
  userProfile = signal<User | null>(null);
  userId!: string;
  receiverId!: string;
  messages: Message[] = [];
  isUserLoaded = false;

  constructor(
    private messagingService: MessagingService,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.receiverId = this.route.snapshot.paramMap.get('receiverId') ?? '';

    this.userService.getUserProfile().subscribe((user: User) => {
      this.userProfile.set(user);
      this.userId = user.id;
      this.isUserLoaded = true;
      this.loadMessages();
    });
  }

  loadMessages() {
    if (!this.isUserLoaded) return;

    this.messagingService.getMessages().subscribe((msgs) => {
      this.messages = msgs.filter(
        (msg) => msg.senderId === this.receiverId || msg.receiverId === this.receiverId
      );
    });

    // ✅ Listen for new messages only after user data is available
    this.messagingService.listenForMessages().subscribe((newMessage) => {
      if (newMessage.senderId === this.receiverId || newMessage.receiverId === this.receiverId) {
        this.messages.push(newMessage);
      }
    });
  }

  markAsRead(message: Message) {
    if (!message.read && message.receiverId === this.userId) {
      this.messagingService.markAsRead(message.id).subscribe(() => {
        message.read = true;
      });
    }
  }
}
