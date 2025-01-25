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
  public parseBusinessIdeaResponse(response: string): BusinessIdea {
    const sections = response.split('\n\n').map((section) => section.trim());
    return {
      ideaTitle: this.extractSection(sections, '1. **Idea Title:**'),
      ideaSummary: this.extractSection(sections, '2. **Idea Summary:**'),
      whyThisFitsThem: this.extractSection(
        sections,
        '3. **Why This Fits Them:**'
      ),
      uniqueSellingProposition: this.extractSection(
        sections,
        '4. **Unique Selling Proposition (USP):**'
      ),
      firstSteps: this.extractSteps(sections, '5. **First Steps:**'),
      potentialSuccessMetrics: this.extractMetrics(
        sections,
        '6. **Potential Success Metrics:**'
      ),
    };
  }

  // Extract simple sections like title, summary, etc.
  private extractSection(sections: string[], label: string): string {
    const section = sections.find((section) => section.startsWith(label));
    return section ? section.replace(label, '').trim() : '';
  }

  // Extract bullet points for "First Steps"
  private extractSteps(
    sections: string[],
    label: string
  ): { [key: string]: string } {
    const section = sections.find((section) => section.startsWith(label));
    if (!section) return {};

    const lines = section
      .replace(label, '')
      .trim()
      .split('\n')
      .map((line) => line.trim());

    const steps: { [key: string]: string } = {};
    lines.forEach((line) => {
      // Match "- Step X: {Description}" format
      const match = line.match(/^-\s*(Step \d+):\s*(.*)$/);
      if (match) {
        const key = match[1]; // e.g., "Step 1"
        const value = match[2]; // e.g., "Conduct market research..."
        steps[key] = value;
      }
    });

    return steps;
  }

  // Extract bullet points for "Potential Success Metrics"
  private extractMetrics(
    sections: string[],
    label: string
  ): { [key: string]: string } {
    const section = sections.find((section) => section.startsWith(label));
    if (!section) return {};
    const lines = section.replace(label, '').trim().split('\n');
    let metrics: { [key: string]: string } = {};
    lines.forEach((line) => {
      const parts = line.split(':');
      if (parts.length === 2) {
        const key = parts[0].trim();
        const value = parts[1].trim();
        metrics[key] = value;
      }
    });
    return metrics;
  }

  public parseApiResponse(apiResponse: ApiResponse): ParsedResponse {
    const { profile, tweets, businessIdea } = apiResponse;

    const ideaSections = businessIdea.split(/\n\n/);
    const parseSection = (prefix: string) =>
      ideaSections
        .find((section) => section.startsWith(prefix))
        ?.replace(prefix, '')
        .trim() || '';

    return {
      username: profile.screen_name,
      profileImage: profile.profile_image_url_https.replace('_normal', ''),
      followers: profile.followers_count,
      tweets,
      businessIdea: {
        catchyName: parseSection('1. **Catchy Name:**'),
        whatItIs: parseSection('2. **What It Is:**'),
        tagline: parseSection('3. **Tagline:**'),
        tweetableHook: parseSection('4. **Tweetable Hook:**'),
      },
    };
  }
}
