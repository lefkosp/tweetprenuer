import { Injectable } from '@angular/core';
import {
  ApiResponse,
  BusinessIdea,
  ParsedResponse,
} from '../models/idea.model';

@Injectable({
  providedIn: 'root',
})
export class IdeaService {
  public parseApiResponse(apiResponse: ApiResponse): ParsedResponse {
    const { profile, tweets, businessIdea } = apiResponse;

    // Split the entire businessIdea string into sections based on double newlines
    const ideaSections = businessIdea
      .split(/\n\n/)
      .map((section) => section.trim());

    // Helper to extract a section by its exact prefix
    const parseSection = (prefix: string): string => {
      const section = ideaSections.find((section) =>
        section.toLowerCase().startsWith(prefix.toLowerCase())
      );
      return section ? section.slice(prefix.length).trim() : '';
    };

    // --- Catchy Name Extraction ---
    const catchyBlock = ideaSections.find((section) =>
      section.startsWith('📌')
    );
    let catchyName = '';
    if (catchyBlock) {
      const match = catchyBlock.match(/\*\*(.*?)\*\*/);
      catchyName = match
        ? match[1].trim()
        : catchyBlock.replace('📌', '').trim();
    }

    // --- "What We Do" Section ---
    const whatWeDo = parseSection('💡 What We Do:');

    // --- Tagline Extraction ---
    const taglineRaw = parseSection('✨ Tagline (Social Hook):');
    const tagline = taglineRaw.replace(/^[*"'""]+|[*"'""]+$/g, '').trim();

    // --- Color Theme Extraction ---
    const colorThemeSection = parseSection('🎨 Color Theme:');
    let background = '';
    let border = '';
    if (colorThemeSection) {
      const lines = colorThemeSection.split('\n');
      lines.forEach((line) => {
        const parts = line.split(':');
        if (parts.length > 1) {
          const key = parts[0].trim().toLowerCase();
          const value = parts.slice(1).join(':').trim();
          const hexMatch = value.match(/#([0-9A-Fa-f]{6})/);
          if (hexMatch) {
            const hexCode = `#${hexMatch[1]}`;
            if (key === 'background') {
              background = hexCode;
            } else if (key === 'border') {
              border = hexCode;
            }
          }
        }
      });
    }
    const textColor = '#333333';

    return {
      username: profile.screen_name,
      profileImage: profile.profile_image_url_https.replace('_normal', ''),
      followers: profile.followers_count,
      tweets,
      businessIdea: {
        catchyName,
        whatWeDo,
        tagline,
        colorTheme: {
          background,
          border,
          text: textColor,
        },
      },
    };
  }
}
