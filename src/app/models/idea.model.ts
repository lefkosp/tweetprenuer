// idea.model.ts
export interface BusinessIdea {
  catchyName: string;
  whatWeDo: string;
  tagline: string;
  colorTheme: {
    background: string;
    border: string;
    text: string;
  };
}

export interface ParsedResponse {
  name: string;
  username: string;
  profileImage: string;
  followers: number;
  businessIdea: BusinessIdea;
  tweets: { id: string; content: string }[];
}

export interface ApiResponse {
  profile: {
    name: string;
    screen_name: string;
    profile_image_url_https: string;
    followers_count: number;
  };
  businessIdea: string;
  tweets: string[];
}
