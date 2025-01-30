import { Component, OnInit, signal } from '@angular/core';
import { MentorshipService } from '../../services/mentorship/mentorship.service';
import { Grade, User } from '../../models/types';
import { UserService } from '../../services/user/user.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-mentorship',
  templateUrl: './mentorship.component.html',
  styleUrls: ['./mentorship.component.scss'],
  imports: [NgFor],
})
export class MentorshipComponent implements OnInit {
  mentors: any[] = [];
  user = signal<User | null>(null);
  usersGrade = signal<Grade | null>(null);

  constructor(
    private mentorshipService: MentorshipService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.getUserProfile().subscribe((user: User) => {
            this.user.set(user);
          });
    this.userService.getUserGrade().subscribe((grade: any) => {
      this.usersGrade.set(grade);
    });

    this.mentorshipService.getMentors().subscribe(mentors => {
      this.mentors = mentors.filter(m => {
        const userGrade = this.usersGrade();
        return userGrade ? m.grade.graduationYear < userGrade.graduationYear : false;
      });
    });
  }

  requestMentor(mentorId: string) {
  this.mentorshipService.requestMentorship(mentorId).subscribe({
    next: (response) => {
      alert('Mentorship request sent successfully! 🎉');
    },
    error: (err) => {
      alert(`Failed to send mentorship request: ${err.error.message || 'Unknown error'}`);
    }
  });
}
}
