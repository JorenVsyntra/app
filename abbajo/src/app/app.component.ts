import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'abbajo';
  Posts: string[] = [];
  filteredPosts: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Here we simulate the mock posts as if they were fetched from an API
    this.getPosts().subscribe((data: string[]) => {
      this.Posts = data;  // Assume the API returns an array of strings
      this.filteredPosts = [...this.Posts];  // Initialize filtered posts
    });
  }

  // Simulating an API call with mock data
  getPosts(): Observable<string[]> {
    // Example of some make-shift posts
    const mockPosts: string[] = [
      'Route 1: Central Park',
      'Route 2: Grand Avenue',
      'Route 3: Sunset Boulevard',
      'Route 4: Riverside Drive',
      'Route 5: Oak Street',
      'Route 6: Maple Avenue',
      'Route 7: Pine Road'
    ];
    return of(mockPosts);  // Use `of` to return mock data as an observable
  }

  searchFunction(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const query = inputElement.value;
    if (!query) {
      this.filteredPosts = [...this.Posts];
    } else {
      this.filteredPosts = this.Posts.filter(post =>
        post.toLowerCase().includes(query.toLowerCase())
      );
    }
  }
}