// profile.component.ts
import { Component, OnInit } from '@angular/core';

interface ProfileData {
  username: string;
  email: string;
  address: string;
  nickname: string;
  dob: string;
  profilePicture: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileData: ProfileData = {
    username: 'Jenny Wilson',
    email: 'jenny@gmail.com',
    address: 'New York, USA',
    nickname: 'Sky Angel',
    dob: 'April 28, 1981',
    profilePicture: 'assets/default-profile.jpg'
  };

  editField: string | null = null;

  onEdit(field: string) {
    this.editField = field;
  }

  onSave() {
    this.editField = null;
    // Add your save logic here
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Convert to base64 or handle file upload
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileData.profilePicture = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}