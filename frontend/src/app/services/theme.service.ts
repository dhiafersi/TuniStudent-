import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    darkMode = signal<boolean>(false);

    constructor() {
        // Check local storage or system preference
        const isDark = localStorage.getItem('theme') === 'dark' ||
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

        this.setDarkMode(isDark);
    }

    toggle() {
        this.setDarkMode(!this.darkMode());
    }

    private setDarkMode(isDark: boolean) {
        this.darkMode.set(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }
}
