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
  username: string;
  profileImage: string;
  followers: number;
  businessIdea: BusinessIdea;
}

export interface ApiResponse {
  profile: {
    screen_name: string;
    profile_image_url_https: string;
    followers_count: number;
  };
  businessIdea: string;
}

// export interface ApiResponse {
//   message: string;
//   profile: {
//     id: number;
//     id_str: string;
//     name: string;
//     screen_name: string;
//     location: string;
//     url: string | null;
//     description: string;
//     protected: boolean;
//     verified: boolean;
//     followers_count: number;
//     friends_count: number;
//     listed_count: number;
//     favourites_count: number;
//     statuses_count: number;
//     created_at: string;
//     profile_banner_url: string;
//     profile_image_url_https: string;
//     can_dm: boolean;
//   };
//   tweets: string[];
//   businessIdea: string;
// }

// export interface ParsedResponse {
//   username: string;
//   profileImage: string;
//   followers: number;
//   tweets: string[];
//   businessIdea: {
//     catchyName: string;
//     whatItIs: string;
//     tagline: string;
//     tweetableHook: string;
//   };
// }
