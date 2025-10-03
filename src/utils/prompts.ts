export const TWITTER_THREAD_PROMPT = `You are a professional social media content creator specializing in Twitter/X threads.

Given the following video transcript, create an engaging Twitter/X thread (6-8 tweets).

TRANSCRIPT:
{transcript}

STYLE REFERENCE:
Write like this example - simple, conversational, and authentic:

"It's been a year since I joined X

At that time I had a stable dev job and a side obsession with design

Few months later the X founder mentality got me, I quit my job and started a design studio

and I won't lie, it's a challenge, half of the time I don't know what I'm doing

but I already met so many great people, learned so much and it has just been so worth it

I would do it again any time

What stopping you?"

REQUIREMENTS:
1. Write in plain, natural language - NO special formatting, NO bold text, NO asterisks
2. Create 6-8 separate tweets in a thread
3. Separate each tweet with a DOUBLE line break (blank line between tweets)
4. CRITICAL: First tweet MUST be an attention-grabbing hook that makes people want to click "Show this thread"
   - Use a controversial statement, surprising fact, bold claim, or compelling question
   - Make it stand alone but create curiosity for the rest
   - Examples: "Just when you thought...", "This changed everything...", "Here's what nobody tells you about..."
5. Keep it conversational and authentic
6. Minimal emojis (0-2 total across the entire thread, only if it feels natural)
7. Last tweet should end with a question or call-to-action
8. Each tweet should be concise and impactful
9. No hashtags unless they're essential to the message

FORMAT:
Tweet 1 content here

Tweet 2 content here

Tweet 3 content here

etc.

DO NOT use any markdown formatting (**bold**, __italic__, etc.)
DO NOT number the tweets
Use DOUBLE line breaks between each tweet.`;

export const STANDALONE_TWEETS_PROMPT = `You are a professional social media content creator specializing in Twitter/X.

Given the following video transcript, create 4 standalone tweets that capture key insights.

TRANSCRIPT:
{transcript}

STYLE REFERENCE:
Write simple, quotable tweets like these examples - NO special formatting:

Example 1:
"Rich people buy time, poor people buy stuff, ambitious people buy skills."

Example 2:
"Want 2025 to be your best year yet? Remember this: Eliminate distractions, get started, improve relentlessly, and never quit. Today is the perfect day to re-engineer your future self. #NoMoreResolutions #ActionToday"

REQUIREMENTS:
1. Each tweet works independently - not a thread
2. Write in plain text - NO markdown, NO asterisks, NO special formatting
3. Keep under 280 characters
4. Make them quotable and shareable
5. Minimal emojis (0-1 per tweet, only if natural)
6. Focus on actionable insights or thought-provoking statements
7. Can include 1-2 relevant hashtags at the end if it adds value

DO NOT use any markdown formatting
DO NOT number the tweets
Just write each tweet as plain text, separated by blank lines.`;

export const LINKEDIN_POST_PROMPT = `You are a professional LinkedIn content creator.

Given the following video transcript, create 2 engaging LinkedIn posts.

TRANSCRIPT:
{transcript}

STYLE REFERENCE:
Write in this clean, simple LinkedIn style - short paragraphs with lots of white space:

"If you are at 12 LPA, you will see someone making 24 LPA.
If you are at 24 LPA, you will see someone making 36 LPA.
If you are at 36 LPA, you will see someone making 50 LPA.

Even at 1 Cr, you'll find someone making more than you, with the same experience and background.

That's why so many people stay restless.

Not because they don't have enough,
But because they know someone else is making more.

I've seen not just young, but even mature professionals lose their peace of mind because of this comparison.

Chasing others never ends.

There will always be someone making more than you with the same age and experience.

The only real win is being ahead of who you were.

If you don't learn that, no salary or lifestyle will ever make you feel happy :)"

REQUIREMENTS:
1. Write in plain text - NO markdown formatting, NO asterisks, NO special symbols
2. Very short paragraphs (1-3 lines max)
3. Lots of white space between paragraphs (single line breaks)
4. Professional yet conversational tone
5. Start with a strong hook
6. Make it scannable and easy to read on mobile
7. Minimal emojis (0-2 total, only at the end if natural)
8. End with a thought-provoking question or insight
9. Length: 800-1200 characters per post
10. Hashtags only if genuinely relevant (max 2-3 at the very end)

Make the 2 posts distinct:
- Post 1: Focus on key insights/lessons
- Post 2: Focus on actionable advice/steps

DO NOT use any markdown formatting
DO NOT use bold (**text**) or italic text
Just write clean, simple text with natural line breaks.`;

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
