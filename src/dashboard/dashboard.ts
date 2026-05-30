import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, timeout } from 'rxjs';
import { Book } from '../book/book';
import { BookService } from '../book/book.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit {
  books: Book[] = [];

  book: Book = {
    title: '',
    author: '',
    category: '',
    description: '',
  };

  searchKeyword: string = '';
  message: string = '';
  emptyMessage: string = 'No reading items found. Add your first reading item above.';

  currentUsername: string = '';
  currentRole: string = '';

  page: number = 0;
  size: number = 5;
  totalPages: number = 0;

  isEditing: boolean = false;
  editingId?: number;

  isListLoading: boolean = false;
  isSaving: boolean = false;

  currentSpeech?: SpeechSynthesisUtterance;

  constructor(
    private bookService: BookService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');
    const role = localStorage.getItem('role');

    if (!username || !password) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUsername = username;
    this.currentRole = role === 'ADMIN' ? 'Admin' : 'User';

    this.loadBooks();
  }

  isAdmin(): boolean {
    return localStorage.getItem('role') === 'ADMIN';
  }

  askAdminLogin(): void {
    const goToLogin = confirm(
      'Admin access is required to update or delete books. Do you want to login as admin now?',
    );

    if (goToLogin) {
      localStorage.removeItem('username');
      localStorage.removeItem('password');
      localStorage.removeItem('role');
      this.router.navigate(['/login']);
    } else {
      this.message = 'Update and delete actions require admin login.';
    }
  }

  loadBooks(): void {
    this.isListLoading = true;

    const isSearching = this.searchKeyword.trim() !== '';

    const request = isSearching
      ? this.bookService.searchBooks(this.searchKeyword, this.page, this.size)
      : this.bookService.getBooks(this.page, this.size);

    request
      .pipe(
        timeout(7000),
        finalize(() => {
          this.isListLoading = false;
        }),
      )
      .subscribe({
        next: (response: any) => {
          this.books = response.content || response;
          this.totalPages = response.totalPages || 1;

          if (isSearching && this.books.length === 0) {
            this.emptyMessage = 'Not found.';
          } else {
            this.emptyMessage = 'No reading items found. Add your first reading item above.';
          }
        },
        error: (error: Error) => {
          this.message = error.message || 'Load books failed. Please check backend.';
        },
      });
  }

  saveBook(bookForm: NgForm): void {
    if (bookForm.invalid) {
      bookForm.form.markAllAsTouched();
      this.message = 'Please complete all required fields before submitting.';
      return;
    }

    if (this.isEditing && !this.isAdmin()) {
      this.askAdminLogin();
      return;
    }

    const cleanBook: Book = {
      title: this.book.title.trim(),
      author: this.book.author.trim(),
      category: this.book.category.trim(),
      description: this.book.description.trim(),
    };

    this.isSaving = true;
    this.message = this.isEditing ? 'Updating book...' : 'Adding book...';

    if (this.isEditing && this.editingId !== undefined) {
      const updatedId = this.editingId;

      this.bookService
        .updateBook(updatedId, cleanBook)
        .pipe(
          timeout(7000),
          finalize(() => {
            this.isSaving = false;
          }),
        )
        .subscribe({
          next: () => {
            this.message = 'Book updated successfully.';

            this.books = this.books.map((item) => {
              if (item.id === updatedId) {
                return {
                  ...item,
                  ...cleanBook,
                  id: updatedId,
                };
              }

              return item;
            });

            this.resetForm(bookForm);
            this.loadBooks();

            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            });
          },
          error: (error: Error) => {
            this.isSaving = false;
            this.message = error.message || 'Update failed. Please check backend PUT endpoint.';
          },
        });

      return;
    }

    this.bookService
      .addBook(cleanBook)
      .pipe(
        timeout(7000),
        finalize(() => {
          this.isSaving = false;
        }),
      )
      .subscribe({
        next: () => {
          this.message = 'Book added successfully.';

          this.resetForm(bookForm);
          this.loadBooks();

          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        },
        error: (error: Error) => {
          this.isSaving = false;
          this.message = error.message || 'Add failed. Please check backend POST endpoint.';
        },
      });
  }

  editBook(selectedBook: Book): void {
    if (!this.isAdmin()) {
      this.askAdminLogin();
      return;
    }

    this.isEditing = true;
    this.editingId = selectedBook.id;

    this.book = {
      title: selectedBook.title,
      author: selectedBook.author,
      category: selectedBook.category,
      description: selectedBook.description,
    };

    this.message = 'Editing selected book. Make your changes and click Update.';

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  deleteBook(id: number | undefined): void {
    if (!this.isAdmin()) {
      this.askAdminLogin();
      return;
    }

    if (id === undefined) {
      this.message = 'Unable to delete this item because the ID is missing.';
      return;
    }

    if (!confirm('Are you sure you want to delete this book?')) {
      return;
    }

    this.isSaving = true;
    this.message = 'Deleting book...';

    this.bookService
      .deleteBook(id)
      .pipe(
        timeout(7000),
        finalize(() => {
          this.isSaving = false;
        }),
      )
      .subscribe({
        next: () => {
          this.message = 'Book deleted successfully.';
          this.loadBooks();
        },
        error: (error: Error) => {
          this.isSaving = false;
          this.message = error.message || 'Delete failed. Please check backend DELETE endpoint.';
        },
      });
  }

  searchBooks(): void {
    this.page = 0;
    this.loadBooks();
  }

  showAllBooks(): void {
    this.searchKeyword = '';
    this.page = 0;
    this.emptyMessage = 'No reading items found. Add your first reading item above.';
    this.loadBooks();
  }

  nextPage(): void {
    if (this.page + 1 < this.totalPages) {
      this.page++;
      this.loadBooks();
    }
  }

  previousPage(): void {
    if (this.page > 0) {
      this.page--;
      this.loadBooks();
    }
  }

  readAloud(book: Book): void {
    if (!('speechSynthesis' in window)) {
      this.message = 'Text-to-speech is not supported in this browser.';
      return;
    }

    const text = `${book.title}. Written by ${book.author}. Category: ${book.category}. Description: ${book.description}`;

    window.speechSynthesis.cancel();

    setTimeout(() => {
      const speech = new SpeechSynthesisUtterance(text);

      speech.lang = 'en-US';
      speech.rate = 0.9;
      speech.pitch = 1;
      speech.volume = 1;

      this.currentSpeech = speech;

      speech.onstart = () => {
        this.message = 'Reading aloud...';
      };

      speech.onend = () => {
        this.message = 'Finished reading.';
        this.currentSpeech = undefined;
      };

      speech.onerror = (event: SpeechSynthesisErrorEvent) => {
        if (event.error === 'interrupted' || event.error === 'canceled') {
          this.message = 'Reading stopped.';
        } else {
          this.message = 'Read aloud error: ' + event.error;
        }

        this.currentSpeech = undefined;
      };

      window.speechSynthesis.speak(speech);
    }, 300);
  }

  stopReading(): void {
    window.speechSynthesis.cancel();
    this.currentSpeech = undefined;
    this.message = 'Reading stopped.';
  }

  logout(): void {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    localStorage.removeItem('role');

    window.speechSynthesis.cancel();
    this.currentSpeech = undefined;

    this.router.navigate(['/login']);
  }

  resetForm(bookForm?: NgForm): void {
    this.book = {
      title: '',
      author: '',
      category: '',
      description: '',
    };

    this.isEditing = false;
    this.editingId = undefined;

    if (bookForm) {
      bookForm.resetForm();
    }
  }
}
