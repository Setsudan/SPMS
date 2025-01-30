import { Component, Input } from '@angular/core';
import { Message, MessagingService } from '../../services/messaging/messaging.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  imports: [FormsModule],
})
export class ChatComponent {
  @Input() receiverId!: string;
  messageContent = '';

  constructor(private messagingService: MessagingService) {}

  sendMessage() {
    if (this.messageContent.trim()) {
      this.messagingService.sendMessage(this.receiverId, this.messageContent).subscribe((msg: Message) => {
        this.messagingService.emitMessage(msg);
        this.messageContent = '';
      });
    }
  }
}
