export const TWITTER_THREAD_PROMPT = `You are a professional social media content creator specializing in Twitter/X threads.

Given the following video transcript, create an engaging Twitter/X thread (8-12 tweets).

TRANSCRIPT:
{transcript}

REQUIREMENTS:
1. First tweet should be a hook that grabs attention
2. Each tweet should be standalone but connected to the thread
3. Use simple, conversational language
4. Include relevant emojis (but don't overdo it)
5. Break down complex ideas into simple points
6. End with a call-to-action or thought-provoking question
7. Keep each tweet under 280 characters
8. Number the tweets (1/, 2/, etc.)

Format your response as a numbered thread, one tweet per line.`;

export const STANDALONE_TWEETS_PROMPT = `You are a professional social media content creator specializing in Twitter/X.

Given the following video transcript, create 3-5 standalone tweets that capture key insights.

TRANSCRIPT:
{transcript}

REQUIREMENTS:
1. Each tweet should work independently (not a thread)
2. Focus on the most impactful takeaways
3. Use attention-grabbing hooks
4. Include relevant emojis
5. Keep each tweet under 280 characters
6. Make them shareable and quotable

Format your response as separate tweets, clearly separated.`;

export const LINKEDIN_POST_PROMPT = `You are a professional LinkedIn content creator.

Given the following video transcript, create 1-2 engaging LinkedIn posts.

TRANSCRIPT:
{transcript}

REQUIREMENTS:
1. Professional yet conversational tone
2. Start with a compelling hook
3. Include key insights and takeaways
4. Use short paragraphs for readability
5. Add relevant emojis sparingly
6. Include a call-to-action at the end
7. Optimal length: 1200-1500 characters
8. Focus on providing value to the audience

If creating 2 posts, make them distinct (e.g., one focused on insights, one on actionable tips).

Format your response clearly, separating multiple posts if applicable.`;

/**
 * Replace template variables in prompts
 */
export function fillPromptTemplate(template: string, variables: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{${key}}`, 'g'), value);
  }
  return result;
}

/**
 * Generate all content types from transcript
 */
export function generatePrompts(transcript: string) {
  return {
    twitterThread: fillPromptTemplate(TWITTER_THREAD_PROMPT, { transcript }),
    standaloneTweets: fillPromptTemplate(STANDALONE_TWEETS_PROMPT, { transcript }),
    linkedinPost: fillPromptTemplate(LINKEDIN_POST_PROMPT, { transcript })
  };
}
