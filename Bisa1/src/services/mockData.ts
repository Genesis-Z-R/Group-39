import { User, Question, Answer, Comment, Tag, Notification } from '../types';

// Mock users with realistic data
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'John Doe',
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Senior React Native developer with 5+ years of experience. Passionate about mobile development and open source.',
    reputation: 1250,
    followers: 45,
    following: 23,
    isVerified: true,
    createdAt: new Date('2023-01-01'),
    password: 'password1',
  },
  {
    id: '2',
    username: 'Jane Smith',
    name: 'Jane Smith',
    email: 'jane@example.com',
    bio: 'Full-stack developer specializing in React and Node.js. Building scalable web applications.',
    reputation: 890,
    followers: 32,
    following: 18,
    isVerified: false,
    createdAt: new Date('2023-03-15'),
    password: 'password2',
  },
  {
    id: '3',
    username: 'Mike Johnson',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    bio: 'TypeScript enthusiast and software architect. Helping teams build better software.',
    reputation: 2100,
    followers: 78,
    following: 45,
    isVerified: true,
    createdAt: new Date('2022-08-20'),
    password: 'password3',
  },
  {
    id: '4',
    username: 'Sarah Wilson',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    bio: 'Mobile app developer focused on performance optimization and user experience.',
    reputation: 1560,
    followers: 56,
    following: 29,
    isVerified: true,
    createdAt: new Date('2023-02-10'),
    password: 'password4',
  },
  {
    id: '5',
    username: 'Alex Chen',
    name: 'Alex Chen',
    email: 'alex@example.com',
    bio: 'Junior developer learning React Native. Excited to contribute to the community!',
    reputation: 750,
    followers: 12,
    following: 8,
    isVerified: false,
    createdAt: new Date('2023-06-01'),
    password: 'password5',
  },
  {
    id: '6',
    username: 'Emily Davis',
    name: 'Emily Davis',
    email: 'emily@example.com',
    bio: 'UI/UX designer turned developer. Creating beautiful and functional mobile experiences.',
    reputation: 980,
    followers: 34,
    following: 22,
    isVerified: true,
    createdAt: new Date('2023-04-05'),
    password: 'password6',
  },
];

// Mock tags
export const mockTags: Tag[] = [
  { id: '1', name: 'react-native', description: 'React Native development', questionCount: 1250, followers: 890 },
  { id: '2', name: 'javascript', description: 'JavaScript programming', questionCount: 3200, followers: 2100 },
  { id: '3', name: 'typescript', description: 'TypeScript development', questionCount: 980, followers: 650 },
  { id: '4', name: 'authentication', description: 'User authentication and security', questionCount: 450, followers: 320 },
  { id: '5', name: 'performance', description: 'App performance optimization', questionCount: 320, followers: 280 },
  { id: '6', name: 'expo', description: 'Expo development platform', questionCount: 780, followers: 520 },
  { id: '7', name: 'redux', description: 'State management with Redux', questionCount: 650, followers: 420 },
  { id: '8', name: 'navigation', description: 'React Navigation', questionCount: 420, followers: 310 },
];

// Mock comments
export const mockComments: Comment[] = [
  {
    id: '1',
    content: 'Great question! I\'ve been looking for this too.',
    author: mockUsers[1],
    parentId: '1',
    parentType: 'question',
    upvotes: 3,
    downvotes: 0,
    createdAt: new Date('2024-01-15T09:00:00'),
  },
  {
    id: '2',
    content: 'This is exactly what I needed. Thanks for asking!',
    author: mockUsers[2],
    parentId: '1',
    parentType: 'question',
    upvotes: 5,
    downvotes: 1,
    createdAt: new Date('2024-01-15T10:30:00'),
  },
  {
    id: '3',
    content: 'Have you tried using Firebase Auth? It\'s much simpler.',
    author: mockUsers[3],
    parentId: '1',
    parentType: 'answer',
    upvotes: 2,
    downvotes: 0,
    createdAt: new Date('2024-01-15T11:15:00'),
  },
];

// Mock answers
export const mockAnswers: Answer[] = [
  {
    id: '1',
    content: `🌋 I'm a geologist and I can help explain what's happening!

**The eruption timeline:**
Based on historical data from Fagradalsfjall, these eruptions typically last 2-4 weeks. The current activity suggests this could be a longer event.

**What to expect:**
- Ash clouds will continue for 1-2 weeks
- Air travel disruptions for 3-5 days
- Lava flow will stabilize within a week
- Seismic activity will gradually decrease

**For your London flight:**
- Check with your airline daily
- Consider booking flexible tickets
- Monitor volcanic ash advisories
- Have a backup plan ready

**The science behind it:**
This is part of the Reykjanes Peninsula volcanic system that's been active since 2021. The magma chamber is still pressurized, so we might see more eruptions.

**Pro tip:** Book flights that route further south to avoid the ash cloud! Most airlines are already adjusting routes.

**My prediction:** Your flight should be fine if it's next week, but definitely check 24-48 hours before departure! 🛩️

Stay safe and good luck with your travels! 🌍✈️`,
    author: mockUsers[0],
    questionId: '1',
    comments: [mockComments[2]],
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
    ],
    upvotes: 156,
    downvotes: 12,
    isAccepted: false,
    userVote: null,
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-15T10:30:00'),
  },
  {
    id: '2',
    content: `🦁 I've been on 5 safaris in East Africa! Here's my advice:

**For Tanzania/Serengeti:**
The best time for calving season is January-March. You'll see thousands of wildebeest giving birth, which attracts predators like lions and cheetahs.

**Photography tips:**
- Get up at 5 AM for the best light
- Use a 100-400mm lens minimum
- Shoot in burst mode for action shots
- Don't forget wide-angle for landscapes
- Bring extra batteries and memory cards

**Best camps I've stayed at:**
- Serengeti Under Canvas (luxury)
- Ngorongoro Crater Lodge (amazing views)
- Lake Manyara Tree Lodge (unique experience)

**Pro tips:**
- Book 12-18 months in advance
- Go during dry season (June-October)
- Hire a private guide if possible
- Don't skip the Ngorongoro Crater

**Your gear is perfect!** The R5 with that lens combo is ideal for wildlife. The drone shots will be incredible over the savanna.

**My favorite moment:** Watching a lioness hunt at dawn with her cubs. Pure magic! 🦁

You're going to love Tanzania! It's even better than Kenya for wildlife density.

#Safari #Tanzania #Photography #Wildlife`,
    author: mockUsers[1],
    questionId: '2',
    comments: [],
    images: [
      'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop'
    ],
    upvotes: 34,
    downvotes: 2,
    isAccepted: true,
    userVote: null,
    createdAt: new Date('2024-01-15T11:15:00'),
    updatedAt: new Date('2024-01-15T11:15:00'),
  },
  {
    id: '3',
    content: `You can also use **Auth0** for a more enterprise-grade solution:

\`\`\`javascript
import Auth0 from 'react-native-auth0';

const auth0 = new Auth0({
  domain: 'your-domain.auth0.com',
  clientId: 'your-client-id'
});

const signIn = async () => {
  try {
    const credentials = await auth0.webAuth.authorize({
      scope: 'openid profile email'
    });
    console.log('Auth0 credentials:', credentials);
  } catch (error) {
    console.error('Auth0 error:', error);
  }
};
\`\`\`

Auth0 provides advanced features like:
- Multi-factor authentication
- Social login providers
- Custom domains
- Advanced security policies`,
    author: mockUsers[2],
    questionId: '1',
    comments: [],
    upvotes: 8,
    downvotes: 0,
    isAccepted: false,
    userVote: null,
    createdAt: new Date('2024-01-15T12:00:00'),
    updatedAt: new Date('2024-01-15T12:00:00'),
  },
];

// Mock questions with realistic content
export const mockQuestions: Question[] = [
  {
    id: '1',
    title: '🌋 Breaking: Iceland volcano eruption affects global air travel! What\'s happening?',
    content: `🚨 MAJOR NEWS ALERT! 🚨

Iceland's Fagradalsfjall volcano just erupted again, and it's causing chaos for international flights! This is the third eruption in just 6 months.

**What we know so far:**
- Eruption started at 6:30 AM local time
- Lava flowing towards Grindavík
- Ash cloud reaching 3km high
- Keflavík Airport operations affected

**Impact on travel:**
- Flights to/from Europe being diverted
- Transatlantic routes disrupted
- Airlines canceling flights
- Travel insurance claims surging

**The science behind it:**
This is part of a new volcanic cycle that started in 2021. Geologists say this could continue for years, affecting global travel patterns.

**My question:**
How long do these eruptions typically last? I have a flight to London next week and I'm worried about delays. Should I reschedule?

Anyone else affected by this? Share your travel horror stories! 😰

#Iceland #Volcano #Travel #BreakingNews #Aviation`,
    author: mockUsers[0],
    tags: ['volcano', 'travel', 'breaking-news', 'aviation'],
    answers: mockAnswers,
    comments: [mockComments[0], mockComments[1]],
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
    ],
    upvotes: 1250,
    downvotes: 23,
    views: 45678,
    isAnswered: true,
    userVote: null,
    createdAt: new Date('2024-01-15T09:00:00'),
    updatedAt: new Date('2024-01-15T09:00:00'),
  },
  {
    id: '2',
    title: '🦁 Just returned from Safari in Kenya! AMA about wildlife photography',
    content: `Hey everyone! 👋

Just got back from an incredible 2-week safari in the Masai Mara, Kenya! The wildlife was absolutely breathtaking and I managed to capture some amazing shots.

**Highlights of the trip:**
- Witnessed the Great Migration (wildebeest crossing the Mara River)
- Saw the Big 5 (Lion, Elephant, Buffalo, Leopard, Rhino)
- Photographed a rare black rhino
- Stayed at a luxury tented camp

**Photography gear I used:**
- Canon EOS R5
- RF 100-500mm f/4.5-7.1L IS USM
- RF 24-70mm f/2.8L IS USM
- DJI Mini 3 Pro for aerial shots

**Best moments:**
- A pride of lions hunting at dawn
- Elephants bathing in the river
- Cheetah with her cubs
- Sunset over the savanna

**My question:**
I'm planning to go to Tanzania next year for the Serengeti. Any recommendations for the best time to visit? I want to see the calving season.

Also, any tips for wildlife photography? I'm still learning and want to improve my skills.

Share your safari experiences! 🦁🐘🦒

#Safari #Kenya #Wildlife #Photography #Travel`,
    author: mockUsers[1],
    tags: ['safari', 'kenya', 'wildlife', 'photography', 'travel'],
    answers: [],
    comments: [],
    images: [
      'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
    ],
    upvotes: 89,
    downvotes: 5,
    views: 2345,
    isAnswered: false,
    userVote: null,
    createdAt: new Date('2024-01-14T14:30:00'),
    updatedAt: new Date('2024-01-14T14:30:00'),
  },
  {
    id: '3',
    title: '🏆 BREAKING: Argentina wins World Cup 2026! Messi\'s final triumph?',
    content: `⚽ INCREDIBLE NEWS! ⚽

Argentina has just won the 2026 World Cup in a thrilling final against Brazil! This could be Messi's last World Cup appearance, and what a way to go out! 🏆

**Match highlights:**
- Final score: Argentina 3 - Brazil 2
- Messi scored the winning goal in extra time
- Epic comeback from 2-0 down
- Penalty shootout drama avoided

**Key moments:**
- Brazil dominated first half (2-0)
- Argentina's incredible second half comeback
- Messi's 89th minute equalizer
- Dramatic 120th minute winner

**Records broken:**
- Messi becomes the oldest World Cup winner (39)
- Argentina's 4th World Cup title
- First South American final since 2002

**The GOAT debate:**
With this win, Messi now has:
- 4 World Cup appearances
- 1 World Cup title
- 7 Ballon d'Or awards
- Champions League titles

Is he now officially the greatest of all time? 🤔

**My question:**
Where does this rank among the greatest World Cup finals ever? The 1986 Maradona final? The 2010 Spain vs Netherlands?

Share your thoughts! 🇦🇷⚽🏆

#WorldCup #Argentina #Messi #Football #GOAT`,
    author: mockUsers[2],
    tags: ['world-cup', 'football', 'argentina', 'messi', 'sports'],
    answers: [],
    comments: [],
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop'
    ],
    upvotes: 2156,
    downvotes: 89,
    views: 89234,
    isAnswered: true,
    userVote: null,
    createdAt: new Date('2024-01-13T16:45:00'),
    updatedAt: new Date('2024-01-13T16:45:00'),
  },
  {
    id: '4',
    title: '🚀 SpaceX Starship launch successful! Mars mission one step closer?',
    content: `🚀 HISTORIC MOMENT! 🚀

SpaceX just successfully launched Starship SN-25 into orbit! This is a massive milestone for humanity's journey to Mars.

**Launch details:**
- Launch time: 2:30 PM EST
- Location: Starbase, Texas
- Mission: Orbital test flight
- Duration: 90 minutes in space

**What happened:**
- Perfect liftoff from the launch pad
- All 33 Raptor engines firing
- Successful stage separation
- Starship reached orbital velocity
- Controlled re-entry and landing

**Why this matters:**
- First successful orbital flight of Starship
- Paves the way for Mars missions
- Revolutionizes space travel
- Makes Mars colonization possible

**Technical achievements:**
- World's most powerful rocket ever built
- Fully reusable spacecraft
- Can carry 100+ tons to orbit
- Designed for Mars missions

**The future:**
- Next: Moon missions with NASA
- 2025: First crewed flight
- 2030: Mars cargo missions
- 2035: First humans on Mars

**My question:**
How long do you think it will take before we see the first humans on Mars? 10 years? 20 years?

This is the beginning of a new era! 🌍🚀🔴

#SpaceX #Starship #Mars #Space #ElonMusk`,
    author: mockUsers[3],
    tags: ['spacex', 'starship', 'mars', 'space', 'technology'],
    answers: [],
    comments: [],
    images: [
      'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=800&h=600&fit=crop'
    ],
    upvotes: 3456,
    downvotes: 123,
    views: 156789,
    isAnswered: false,
    userVote: null,
    createdAt: new Date('2024-01-12T11:20:00'),
    updatedAt: new Date('2024-01-12T11:20:00'),
  },
  {
    id: '5',
    title: '🍕 Best pizza in NYC? I\'m visiting next week and need recommendations!',
    content: `Hey foodies! 👋

I'm visiting New York City next week for the first time and I'm on a mission to find the BEST pizza in the city! I've heard so many conflicting opinions, I need your help.

**What I'm looking for:**
- Authentic New York style pizza
- Must have that perfect crispy crust
- Great cheese-to-sauce ratio
- Not too expensive (under $25 for a large)

**Places I've heard about:**
- Grimaldi's (Brooklyn)
- Lombardi's (Manhattan)
- Di Fara (Brooklyn)
- Joe's Pizza (Greenwich Village)
- Artichoke Basille's

**My preferences:**
- I love thin crust
- Extra cheese is a must
- Pepperoni is my go-to topping
- I'm staying in Manhattan but willing to travel

**Questions:**
1. Which place has the most authentic NY style?
2. Are the long lines worth it?
3. Any hidden gems I should know about?
4. Best time to visit to avoid crowds?

I'm only in town for 3 days, so I need to make every meal count! 🍕

Share your favorite spots and why you love them! I'll post photos of what I try! 📸

#NYC #Pizza #Food #Travel #Recommendations`,
    author: mockUsers[4],
    tags: ['nyc', 'pizza', 'food', 'travel', 'recommendations'],
    answers: [],
    comments: [],
    images: [
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop'
    ],
    upvotes: 67,
    downvotes: 8,
    views: 1234,
    isAnswered: true,
    userVote: null,
    createdAt: new Date('2024-01-11T09:15:00'),
    updatedAt: new Date('2024-01-11T09:15:00'),
  },
  {
    id: '6',
    title: '🎬 New Marvel movie trailer just dropped! Thoughts on the new direction?',
    content: `🎬 MARVEL FANS ASSEMBLE! 🎬

The new Avengers: Secret Wars trailer just dropped and I'm absolutely blown away! This looks like it could be the biggest Marvel movie ever.

**What we see in the trailer:**
- Multiple Spider-Men (Tobey, Andrew, Tom)
- Doctor Strange variants
- X-Men characters finally joining
- Kang the Conqueror as main villain
- Multiverse chaos everywhere

**My thoughts:**
- The visual effects look INSANE
- The multiverse concept is getting complex
- I'm excited to see the X-Men integration
- The scale looks bigger than Endgame

**Questions I have:**
- How will they handle so many characters?
- Will this be the end of the current MCU era?
- Are we getting more cameos than Endgame?
- How does this connect to the TV shows?

**Theories:**
- Secret Wars will reset the MCU
- We'll see the Fantastic Four
- Deadpool will make an appearance
- This leads to the X-Men reboot

**My question:**
What do you think about the new direction? Are you excited or worried about the multiverse getting too complicated?

Share your theories and predictions! 🦸‍♂️🦸‍♀️

#Marvel #Avengers #SecretWars #MCU #Trailer`,
    author: mockUsers[5],
    tags: ['marvel', 'avengers', 'movies', 'entertainment', 'trailer'],
    answers: [],
    comments: [],
    images: [
      'https://images.unsplash.com/photo-1489599835382-9571cd6bdcdf?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1489599835382-9571cd6bdcdf?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1489599835382-9571cd6bdcdf?w=800&h=600&fit=crop'
    ],
    upvotes: 892,
    downvotes: 45,
    views: 23456,
    isAnswered: false,
    userVote: null,
    createdAt: new Date('2024-01-10T13:45:00'),
    updatedAt: new Date('2024-01-10T13:45:00'),
  },
  {
    id: '16',
    title: '🎓 KNUST Admission Requirements 2024: Computer Science vs Engineering',
    content: `Hey future KNUST students! 👨‍🎓

I'm planning to apply to KNUST for the 2024/2025 academic year, but I'm torn between Computer Science and Electrical Engineering.

**My WASSCE Results:**
- Mathematics: A1
- English: B2
- Physics: A1
- Chemistry: B2
- Biology: B3
- Economics: A1
- Government: B2
- ICT: A1

**Questions:**
1. What are the specific cut-off points for Computer Science vs Electrical Engineering?
2. Which program has better job prospects in Ghana's tech industry?
3. What's the campus life like for engineering students?
4. Are there good internship opportunities with local companies?

**My interests:**
- Software development
- AI and machine learning
- Renewable energy
- Entrepreneurship

I've heard KNUST has excellent facilities and strong industry connections. Any current students or alumni who can share their experiences?

Also, what's the accommodation situation like? Should I apply for on-campus housing or look for off-campus options?

#KNUST #Admission #ComputerScience #Engineering #Ghana`,
    author: mockUsers[2],
    tags: ['KNUST', 'admission', 'computer-science', 'engineering', 'Ghana'],
    answers: [],
    comments: [],
    images: [
      'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
    ],
    upvotes: 234,
    downvotes: 12,
    views: 4567,
    isAnswered: false,
    userVote: null,
    createdAt: new Date('2024-01-13T11:20:00'),
    updatedAt: new Date('2024-01-13T11:20:00'),
  },
  {
    id: '17',
    title: '🇬🇭 Ghana\'s Tech Startup Scene: Who\'s the next Flutterwave?',
    content: `🚀 EXCITING TIMES FOR GHANA'S TECH ECOSYSTEM! 🚀

Ghana's startup scene is absolutely booming! We're seeing incredible innovation across fintech, agritech, healthtech, and edtech.

**Hot Startups to Watch:**
- **Mpharma** - Healthcare logistics and pharmacy management
- **Zeepay** - Mobile money and remittance solutions
- **Farmerline** - Agricultural technology and farmer support
- **KudiGo** - Business management software
- **ExpressPay** - Digital payments and financial services

**Investment Trends:**
- Total funding in 2023: $125M+ (up 40% from 2022)
- Major investors: Y Combinator, 500 Startups, Accion Venture Lab
- Government support through Ghana Innovation Hub

**My question:**
What's the next big opportunity in Ghana's tech space? I'm thinking about starting a startup focused on:
- Renewable energy solutions
- E-commerce for local artisans
- Educational technology
- Logistics and supply chain

**For entrepreneurs:**
- What are the biggest challenges you're facing?
- How's the funding environment?
- Any success stories to share?

**For investors:**
- What sectors are you most excited about?
- What do you look for in Ghanaian startups?

Let's build the future of African tech! 💪

#GhanaTech #Startups #Innovation #Africa #Entrepreneurship`,
    author: mockUsers[3],
    tags: ['Ghana', 'startups', 'tech', 'innovation', 'entrepreneurship'],
    answers: [],
    comments: [],
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
    ],
    upvotes: 567,
    downvotes: 23,
    views: 12345,
    isAnswered: false,
    userVote: null,
    createdAt: new Date('2024-01-12T16:45:00'),
    updatedAt: new Date('2024-01-12T16:45:00'),
  },
  {
    id: '18',
    title: '🏛️ KNUST Campus Life: Dorms, Food, and Student Activities',
    content: `Hey KNUST students! 🎓

I'm starting at KNUST next semester and want to know everything about campus life!

**Questions about accommodation:**
- Which halls are the best for first-year students?
- How's the food in the dining halls?
- Are the rooms comfortable and well-maintained?
- What's the social scene like in different halls?

**Student activities:**
- What clubs and organizations should I join?
- Are there good sports facilities?
- How's the nightlife around campus?
- Any cultural events or festivals?

**Academic life:**
- How's the library and study spaces?
- Are there good computer labs?
- How supportive are the professors?
- What's the workload like?

**My concerns:**
- Safety on and around campus
- Internet connectivity
- Healthcare facilities
- Transportation options

I'm excited but also nervous! Any tips for surviving and thriving at KNUST?

Share your campus experiences! 📚🎉

#KNUST #CampusLife #StudentLife #Ghana`,
    author: mockUsers[4],
    tags: ['KNUST', 'campus-life', 'student-life', 'accommodation'],
    answers: [],
    comments: [],
    images: [
      'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
    ],
    upvotes: 189,
    downvotes: 8,
    views: 3456,
    isAnswered: false,
    userVote: null,
    createdAt: new Date('2024-01-11T13:15:00'),
    updatedAt: new Date('2024-01-11T13:15:00'),
  },
  {
    id: '19',
    title: '🌍 Breaking: New Climate Agreement at COP28 - Impact on Africa',
    content: `🌱 MAJOR CLIMATE NEWS! 🌱

The COP28 climate summit just concluded with a historic agreement! Here's what it means for Africa and Ghana specifically.

**Key Outcomes:**
- **Loss and Damage Fund**: $700B pledged for climate-vulnerable countries
- **Renewable Energy**: Global commitment to triple renewable capacity by 2030
- **Fossil Fuel Phase-out**: First-ever agreement to transition away from fossil fuels
- **Adaptation Funding**: $100B annually for climate adaptation

**Impact on Ghana:**
- **Renewable Energy Projects**: Solar and wind energy development
- **Forest Conservation**: Support for Ghana's REDD+ initiatives
- **Climate-Smart Agriculture**: Funding for sustainable farming practices
- **Coastal Protection**: Support for communities affected by sea-level rise

**What this means:**
- More funding for green projects in Ghana
- Job opportunities in renewable energy sector
- Better support for farmers adapting to climate change
- International partnerships for environmental protection

**My questions:**
1. How will this affect Ghana's energy policy?
2. What opportunities are there for young people in the green economy?
3. How can individuals contribute to climate action?

**Local initiatives to support:**
- Ghana's National Climate Change Policy
- Renewable Energy Master Plan
- Green Ghana Project (tree planting)

This is a game-changer for Africa! Let's discuss how we can make the most of these opportunities.

#ClimateAction #COP28 #Ghana #RenewableEnergy #Sustainability`,
    author: mockUsers[5],
    tags: ['climate-change', 'COP28', 'renewable-energy', 'Africa', 'sustainability'],
    answers: [],
    comments: [],
    images: [
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
    ],
    upvotes: 445,
    downvotes: 18,
    views: 8765,
    isAnswered: false,
    userVote: null,
    createdAt: new Date('2024-01-10T09:30:00'),
    updatedAt: new Date('2024-01-10T09:30:00'),
  },
  {
    id: '20',
    title: '🎵 Ghana\'s Music Industry: Afrobeats, Highlife, and New Genres',
    content: `🎶 GHANA'S MUSIC SCENE IS ON FIRE! 🔥

From traditional Highlife to modern Afrobeats, Ghana's music industry is experiencing a renaissance!

**Current Trends:**
- **Afrobeats Explosion**: Ghanaian artists gaining global recognition
- **Highlife Revival**: Modern takes on traditional sounds
- **Gospel Music**: Growing influence in contemporary music
- **Hip-Hop**: Local artists making waves internationally

**Top Artists to Watch:**
- **Sarkodie**: Ghana's rap king
- **Shatta Wale**: Dancehall sensation
- **Stonebwoy**: Reggae and dancehall fusion
- **Kuami Eugene**: Highlife and Afrobeats
- **King Promise**: Smooth Afrobeats
- **Wendy Shay**: Rising female star

**Industry Developments:**
- **Digital Streaming**: Growth in online music consumption
- **International Collaborations**: Partnerships with global artists
- **Music Festivals**: Afrochella, Ghana Music Awards
- **Record Labels**: New local and international labels

**My questions:**
1. What's the next big trend in Ghanaian music?
2. How can local artists break into international markets?
3. What role does social media play in music promotion?
4. Are there good opportunities for music producers and engineers?

**For musicians:**
- What challenges are you facing in the industry?
- How has the digital age changed your approach to music?
- Any advice for upcoming artists?

**For fans:**
- What genres are you most excited about?
- How do you discover new Ghanaian music?
- What concerts or festivals are you looking forward to?

Let's celebrate Ghana's rich musical heritage! 🎵🇬🇭

#GhanaMusic #Afrobeats #Highlife #MusicIndustry`,
    author: mockUsers[0],
    tags: ['music', 'Ghana', 'afrobeats', 'highlife', 'entertainment'],
    answers: [],
    comments: [],
    images: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
    ],
    upvotes: 678,
    downvotes: 25,
    views: 14567,
    isAnswered: false,
    userVote: null,
    createdAt: new Date('2024-01-09T15:45:00'),
    updatedAt: new Date('2024-01-09T15:45:00'),
  },
  {
    id: '21',
    title: '🏥 Ghana\'s Healthcare System: Progress and Challenges in 2024',
    content: `🏥 HEALTHCARE UPDATE: GHANA'S PROGRESS AND CHALLENGES 🏥

Ghana's healthcare system has made significant strides, but there are still challenges to address.

**Recent Achievements:**
- **National Health Insurance Scheme (NHIS)**: 40% of population covered
- **Maternal Health**: Reduced maternal mortality by 30%
- **Child Vaccination**: 95% immunization coverage
- **HIV/AIDS**: Significant reduction in new infections
- **COVID-19 Response**: Successful vaccination campaign

**Current Challenges:**
- **Infrastructure**: Need for more hospitals and clinics
- **Medical Staff**: Shortage of doctors and nurses
- **Equipment**: Modern medical equipment needed
- **Rural Access**: Healthcare access in remote areas
- **Cost**: High cost of specialized treatments

**Government Initiatives:**
- **Agenda 111**: Building 111 district hospitals
- **Medical Training**: Expanding medical schools
- **Digital Health**: E-health and telemedicine programs
- **Public-Private Partnerships**: Collaboration with private sector

**My questions:**
1. How accessible is quality healthcare in rural areas?
2. What are the costs of common medical procedures?
3. How does the NHIS work for different income levels?
4. What specialties are most needed in Ghana?

**For healthcare workers:**
- What are your biggest challenges?
- How has the system improved in recent years?
- What support do you need?

**For patients:**
- What's your experience with the healthcare system?
- How affordable is medical care?
- Any recommendations for specific hospitals or doctors?

Let's discuss how we can improve healthcare for all Ghanaians! 💊

#Healthcare #Ghana #NHIS #MedicalCare`,
    author: mockUsers[1],
    tags: ['healthcare', 'Ghana', 'NHIS', 'medical', 'public-health'],
    answers: [],
    comments: [],
    images: [
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
    ],
    upvotes: 334,
    downvotes: 15,
    views: 6789,
    isAnswered: false,
    userVote: null,
    createdAt: new Date('2024-01-08T12:20:00'),
    updatedAt: new Date('2024-01-08T12:20:00'),
  },
  {
    id: '22',
    title: '🎓 KNUST Research Opportunities: Undergraduate and Graduate Programs',
    content: `🔬 RESEARCH OPPORTUNITIES AT KNUST! 🔬

KNUST is a research powerhouse! Here's what's available for students interested in research.

**Research Areas:**
- **Agriculture**: Crop improvement, soil science, animal health
- **Engineering**: Renewable energy, materials science, robotics
- **Medicine**: Public health, drug discovery, clinical trials
- **Technology**: AI, cybersecurity, software engineering
- **Environment**: Climate change, conservation, sustainability

**Undergraduate Research:**
- **Final Year Projects**: Industry-sponsored research
- **Summer Internships**: Research positions in labs
- **Student Research Groups**: Peer-led research initiatives
- **Competitions**: National and international research contests

**Graduate Programs:**
- **MSc Programs**: 2-year research-based degrees
- **PhD Programs**: 3-5 year doctoral research
- **Postdoctoral Fellowships**: Advanced research positions
- **International Collaborations**: Partnerships with global institutions

**Funding Opportunities:**
- **KNUST Research Fund**: Internal research grants
- **Government Grants**: National research funding
- **International Grants**: Global research partnerships
- **Industry Sponsorships**: Corporate research projects

**My questions:**
1. How competitive are research positions?
2. What's the application process for research programs?
3. Are there opportunities for international students?
4. What's the quality of research facilities?

**For current researchers:**
- What projects are you working on?
- How's the research environment?
- Any advice for aspiring researchers?

**For students:**
- What research areas interest you?
- How can you get involved in research?
- What skills are needed for research?

Let's explore the exciting world of research at KNUST! 🧪

#KNUST #Research #Science #Innovation`,
    author: mockUsers[2],
    tags: ['KNUST', 'research', 'science', 'innovation', 'academia'],
    answers: [],
    comments: [],
    images: [
      'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
    ],
    upvotes: 156,
    downvotes: 7,
    views: 2987,
    isAnswered: false,
    userVote: null,
    createdAt: new Date('2024-01-07T10:15:00'),
    updatedAt: new Date('2024-01-07T10:15:00'),
  },
  {
    id: '23',
    title: '💰 Ghana\'s Economy 2024: Inflation, Growth, and Investment Opportunities',
    content: `📊 ECONOMIC UPDATE: GHANA'S FINANCIAL LANDSCAPE 📊

Ghana's economy is showing signs of recovery and stability in 2024. Here's the latest analysis.

**Economic Indicators:**
- **GDP Growth**: 3.2% projected for 2024
- **Inflation Rate**: 23.2% (down from 54% in 2023)
- **Exchange Rate**: GHS 12.5 to USD (stabilizing)
- **Interest Rates**: 29% (Bank of Ghana policy rate)
- **Foreign Reserves**: $6.2 billion (improving)

**Sector Performance:**
- **Agriculture**: 4.5% growth (cocoa, cashew, rice)
- **Mining**: 2.8% growth (gold, bauxite, manganese)
- **Services**: 3.1% growth (tourism, finance, telecom)
- **Manufacturing**: 2.5% growth (food processing, textiles)

**Investment Opportunities:**
- **Real Estate**: Growing demand for housing
- **Technology**: Digital transformation initiatives
- **Agriculture**: Modern farming and agribusiness
- **Tourism**: Cultural and eco-tourism development
- **Renewable Energy**: Solar and wind projects

**Government Policies:**
- **IMF Program**: $3 billion Extended Credit Facility
- **Fiscal Consolidation**: Reducing budget deficit
- **Digital Economy**: E-government and fintech support
- **Industrialization**: One District, One Factory initiative

**My questions:**
1. Is this a good time to invest in Ghana?
2. What sectors offer the best returns?
3. How stable is the currency for foreign investors?
4. What are the tax implications for businesses?

**For investors:**
- What opportunities are you seeing?
- What risks should be considered?
- How's the business environment?

**For entrepreneurs:**
- What funding options are available?
- How's the regulatory environment?
- Any success stories to share?

Let's discuss Ghana's economic future! 💼

#GhanaEconomy #Investment #Finance #Business`,
    author: mockUsers[3],
    tags: ['economy', 'Ghana', 'investment', 'finance', 'business'],
    answers: [],
    comments: [],
    images: [
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
    ],
    upvotes: 445,
    downvotes: 22,
    views: 8923,
    isAnswered: false,
    userVote: null,
    createdAt: new Date('2024-01-06T14:30:00'),
    updatedAt: new Date('2024-01-06T14:30:00'),
  },
  {
    id: '24',
    title: '🎬 Ghana\'s Film Industry: Kumawood, Nollywood, and International Recognition',
    content: `🎬 GHANA'S FILM INDUSTRY IS THRIVING! 🎬

From Kumawood to international collaborations, Ghana's film industry is making waves globally!

**Industry Overview:**
- **Kumawood**: Local Ghanaian film industry based in Kumasi
- **Nollywood Collaboration**: Growing partnerships with Nigerian filmmakers
- **International Recognition**: Films winning awards at global festivals
- **Streaming Platforms**: Netflix, Amazon Prime featuring Ghanaian content

**Notable Productions:**
- **"Azali"**: First Ghanaian film on Netflix
- **"The Burial of Kojo"**: Award-winning drama
- **"Keteke"**: Historical drama set in 1980s Ghana
- **"Sidechic Gang"**: Popular comedy series

**Industry Challenges:**
- **Funding**: Limited access to production financing
- **Distribution**: Need for better distribution networks
- **Infrastructure**: Modern film studios and equipment
- **Talent Development**: Training programs for filmmakers

**Success Stories:**
- **Shirley Frimpong-Manso**: Award-winning director
- **John Dumelo**: Actor and politician
- **Yvonne Okoro**: International actress
- **Van Vicker**: Popular actor and producer

**My questions:**
1. How can local filmmakers access international markets?
2. What genres are most popular in Ghana?
3. Are there good training programs for aspiring filmmakers?
4. How's the collaboration with Nollywood working?

**For filmmakers:**
- What challenges are you facing?
- How has the industry evolved?
- Any advice for newcomers?

**For audiences:**
- What types of films do you enjoy?
- How do you discover new Ghanaian films?
- What would you like to see more of?

Let's celebrate Ghana's cinematic achievements! 🎥

#GhanaFilm #Kumawood #Nollywood #Cinema`,
    author: mockUsers[4],
    tags: ['film', 'Ghana', 'Kumawood', 'Nollywood', 'entertainment'],
    answers: [],
    comments: [],
    images: [
      'https://images.unsplash.com/photo-1489599835382-957593cb2371?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
    ],
    upvotes: 289,
    downvotes: 14,
    views: 5678,
    isAnswered: false,
    userVote: null,
    createdAt: new Date('2024-01-05T11:45:00'),
    updatedAt: new Date('2024-01-05T11:45:00'),
  },
  {
    id: '25',
    title: '🌱 Ghana\'s Agricultural Revolution: Modern Farming and Food Security',
    content: `🌾 AGRICULTURAL INNOVATION IN GHANA! 🌾

Ghana's agricultural sector is undergoing a modern transformation with technology and sustainable practices.

**Key Crops and Production:**
- **Cocoa**: World's second-largest producer (800,000+ tons annually)
- **Cashew**: Major export crop with growing demand
- **Rice**: Domestic production increasing (self-sufficiency goal)
- **Maize**: Staple crop with improved varieties
- **Vegetables**: Growing market for fresh produce

**Modern Farming Technologies:**
- **Precision Agriculture**: GPS-guided farming equipment
- **Drones**: Crop monitoring and spraying
- **IoT Sensors**: Soil and weather monitoring
- **Mobile Apps**: Market information and farming advice
- **Greenhouse Technology**: Year-round vegetable production

**Government Initiatives:**
- **Planting for Food and Jobs**: Subsidized inputs program
- **One Village, One Dam**: Irrigation projects
- **Mechanization Centers**: Modern farming equipment
- **Agricultural Extension**: Training for farmers

**Challenges and Solutions:**
- **Climate Change**: Drought-resistant crop varieties
- **Post-Harvest Losses**: Improved storage facilities
- **Market Access**: Digital platforms for farmers
- **Youth Involvement**: Agricultural entrepreneurship programs

**My questions:**
1. How profitable is modern farming in Ghana?
2. What technologies are most accessible to small farmers?
3. How can young people get involved in agriculture?
4. What are the export opportunities?

**For farmers:**
- What technologies are you using?
- How has farming changed in recent years?
- What support do you need?

**For consumers:**
- How important is locally-grown food to you?
- What agricultural products do you buy most?
- Any concerns about food safety?

Let's discuss the future of farming in Ghana! 🚜

#Agriculture #Ghana #Farming #FoodSecurity`,
    author: mockUsers[5],
    tags: ['agriculture', 'Ghana', 'farming', 'food-security', 'technology'],
    answers: [],
    comments: [],
    images: [
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
    ],
    upvotes: 234,
    downvotes: 11,
    views: 4567,
    isAnswered: false,
    userVote: null,
    createdAt: new Date('2024-01-04T13:20:00'),
    updatedAt: new Date('2024-01-04T13:20:00'),
  },
  {
    id: '26',
    title: '🎓 KNUST Alumni Network: Career Opportunities and Mentorship',
    content: `🎓 KNUST ALUMNI: BUILDING SUCCESS TOGETHER! 🎓

The KNUST alumni network is one of the strongest in Africa! Here's how to connect and grow your career.

**Alumni Success Stories:**
- **Business Leaders**: CEOs of major Ghanaian companies
- **Government Officials**: Ministers and policy makers
- **International Organizations**: UN, World Bank, IMF
- **Entrepreneurs**: Successful startup founders
- **Academics**: Professors at top universities worldwide

**Networking Opportunities:**
- **Alumni Chapters**: Local and international groups
- **Annual Reunions**: Homecoming events and celebrations
- **Professional Associations**: Industry-specific groups
- **Mentorship Programs**: Connecting graduates with students
- **Job Placement**: Career services and recruitment

**Career Development:**
- **Continuing Education**: Professional development courses
- **Certification Programs**: Industry-recognized credentials
- **Leadership Training**: Executive development programs
- **International Exposure**: Global career opportunities

**Alumni Benefits:**
- **Library Access**: Continued access to university resources
- **Research Collaboration**: Partnership opportunities
- **Business Networking**: B2B connections and partnerships
- **Investment Opportunities**: Alumni investment funds

**My questions:**
1. How active is the alumni network in my field?
2. What mentorship opportunities are available?
3. How can I give back to current students?
4. Are there international alumni chapters?

**For alumni:**
- How has the network helped your career?
- What events do you attend?
- How do you stay connected?

**For current students:**
- How can you connect with alumni?
- What mentorship are you looking for?
- How can alumni help your career goals?

Let's strengthen the KNUST community! 🤝

#KNUST #Alumni #Networking #Career`,
    author: mockUsers[0],
    tags: ['KNUST', 'alumni', 'networking', 'career', 'mentorship'],
    answers: [],
    comments: [],
    images: [
      'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
    ],
    upvotes: 178,
    downvotes: 6,
    views: 3456,
    isAnswered: false,
    userVote: null,
    createdAt: new Date('2024-01-03T09:15:00'),
    updatedAt: new Date('2024-01-03T09:15:00'),
  },
  {
    id: '27',
    title: '🌐 Ghana\'s Internet Infrastructure: 5G, Fiber, and Digital Transformation',
    content: `🌐 GHANA'S DIGITAL INFRASTRUCTURE UPDATE! 🌐

Ghana is rapidly advancing its digital infrastructure to support the growing digital economy.

**Current Internet Status:**
- **Mobile Penetration**: 150% (multiple SIM cards per person)
- **4G Coverage**: 85% of population covered
- **Fiber Optic**: 15,000+ km of fiber infrastructure
- **Internet Speed**: Average 25 Mbps (improving)
- **Digital Adoption**: 60% of population online

**5G Development:**
- **Pilot Programs**: Testing in major cities
- **Infrastructure**: Base stations being upgraded
- **Spectrum Allocation**: Government preparing for 5G rollout
- **Expected Launch**: 2024-2025 timeline
- **Applications**: IoT, smart cities, autonomous vehicles

**Fiber Optic Expansion:**
- **National Backbone**: Connecting all regions
- **Last Mile**: Connecting homes and businesses
- **International Cables**: Submarine cable connections
- **Rural Connectivity**: Extending to remote areas

**Digital Government:**
- **E-Government Services**: Online public services
- **Digital ID**: Ghana Card integration
- **Smart Cities**: Accra and Kumasi initiatives
- **Digital Payments**: Mobile money and e-commerce

**My questions:**
1. When will 5G be available to consumers?
2. How reliable is internet connectivity in rural areas?
3. What are the costs of high-speed internet?
4. How is the government supporting digital transformation?

**For businesses:**
- How has improved connectivity helped your business?
- What digital services are you using?
- Any challenges with internet reliability?

**For consumers:**
- How satisfied are you with internet speeds?
- What online services do you use most?
- Any concerns about data costs?

Let's discuss Ghana's digital future! 💻

#Internet #5G #Digital #Ghana`,
    author: mockUsers[1],
    tags: ['internet', '5G', 'digital', 'Ghana', 'technology'],
    answers: [],
    comments: [],
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
    ],
    upvotes: 312,
    downvotes: 16,
    views: 6789,
    isAnswered: false,
    userVote: null,
    createdAt: new Date('2024-01-02T16:30:00'),
    updatedAt: new Date('2024-01-02T16:30:00'),
  },
  {
    id: '28',
    title: '🏆 KNUST Sports: Athletics, Football, and Student Competitions',
    content: `⚽ KNUST SPORTS: EXCELLENCE IN ATHLETICS! ⚽

KNUST has a rich sporting tradition with excellent facilities and successful teams.

**Sports Facilities:**
- **Football Stadium**: 15,000 capacity with modern amenities
- **Athletics Track**: Olympic-standard 400m track
- **Swimming Pool**: 50m competition pool
- **Tennis Courts**: Multiple courts with lighting
- **Basketball Courts**: Indoor and outdoor facilities
- **Gymnasium**: Modern fitness center

**Competitive Sports:**
- **Football**: University Premier League champions
- **Athletics**: National university champions
- **Basketball**: Regional champions
- **Swimming**: National university records
- **Tennis**: Inter-university champions

**Student Athletes:**
- **Scholarships**: Athletic scholarships for top performers
- **Training Programs**: Professional coaching staff
- **Academic Support**: Balancing sports and studies
- **International Competitions**: Representing Ghana abroad

**Sports Culture:**
- **Inter-Hall Competitions**: Annual sports festivals
- **Alumni Games**: Former students vs current students
- **Community Outreach**: Sports programs for local schools
- **Professional Development**: Sports management courses

**My questions:**
1. How can I join a sports team at KNUST?
2. What facilities are available for recreational sports?
3. Are there opportunities for non-competitive sports?
4. How do sports scholarships work?

**For athletes:**
- What sports do you participate in?
- How do you balance sports and academics?
- What support do you receive from the university?

**For sports fans:**
- What sporting events do you attend?
- How's the atmosphere at games?
- Any memorable sporting moments?

Let's celebrate KNUST's sporting excellence! 🏃‍♂️

#KNUST #Sports #Athletics #Football`,
    author: mockUsers[2],
    tags: ['KNUST', 'sports', 'athletics', 'football', 'fitness'],
    answers: [],
    comments: [],
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
    ],
    upvotes: 145,
    downvotes: 5,
    views: 2987,
    isAnswered: false,
    userVote: null,
    createdAt: new Date('2024-01-01T12:45:00'),
    updatedAt: new Date('2024-01-01T12:45:00'),
  },
  {
    id: '29',
    title: '🎨 Ghana\'s Creative Arts: Fashion, Design, and Cultural Innovation',
    content: `🎨 GHANA'S CREATIVE ARTS SCENE IS THRIVING! 🎨

From traditional crafts to modern design, Ghana's creative arts industry is gaining international recognition.

**Fashion Industry:**
- **Kente Weaving**: Traditional fabric gaining global appeal
- **Contemporary Designers**: Modern takes on traditional styles
- **Fashion Weeks**: Accra Fashion Week and Kumasi Fashion Week
- **International Collaborations**: Partnerships with global brands
- **Sustainable Fashion**: Eco-friendly materials and practices

**Design and Architecture:**
- **Contemporary Architecture**: Modern buildings with local influences
- **Interior Design**: Fusion of traditional and modern styles
- **Graphic Design**: Digital art and branding
- **Product Design**: Furniture and home decor
- **Urban Planning**: Smart city design concepts

**Cultural Innovation:**
- **Digital Art**: NFTs and digital creativity
- **Music Production**: Modern recording studios
- **Film and Photography**: Visual storytelling
- **Crafts and Pottery**: Traditional skills with modern applications
- **Performance Arts**: Theater, dance, and music

**Industry Support:**
- **Creative Hubs**: Co-working spaces for artists
- **Funding Programs**: Grants for creative projects
- **Training Programs**: Skills development for artists
- **Market Access**: Platforms for selling creative works

**My questions:**
1. How can local artists access international markets?
2. What funding opportunities are available for creative projects?
3. How is technology changing the creative arts?
4. What traditional arts are being preserved?

**For artists:**
- What medium do you work in?
- How has the industry changed?
- What challenges do you face?

**For art lovers:**
- What types of art do you enjoy?
- How do you discover new artists?
- What would you like to see more of?

Let's celebrate Ghana's creative spirit! 🎭

#CreativeArts #Ghana #Fashion #Design`,
    author: mockUsers[3],
    tags: ['creative-arts', 'Ghana', 'fashion', 'design', 'culture'],
    answers: [],
    comments: [],
    images: [
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
    ],
    upvotes: 267,
    downvotes: 12,
    views: 5234,
    isAnswered: false,
    userVote: null,
    createdAt: new Date('2023-12-31T10:20:00'),
    updatedAt: new Date('2023-12-31T10:20:00'),
  },
  {
    id: '30',
    title: '🚀 KNUST Entrepreneurship: Startups, Incubators, and Innovation Hub',
    content: `🚀 KNUST: NURTURING THE NEXT GENERATION OF ENTREPRENEURS! 🚀

KNUST is at the forefront of entrepreneurship education and startup development in Ghana.

**Entrepreneurship Programs:**
- **Business School**: MBA and entrepreneurship degrees
- **Innovation Hub**: Technology and business incubator
- **Startup Accelerator**: 12-week intensive programs
- **Business Plan Competitions**: Annual entrepreneurship contests
- **Mentorship Programs**: Industry experts guiding students

**Success Stories:**
- **Tech Startups**: Mobile apps and software solutions
- **Agribusiness**: Modern farming and food processing
- **Manufacturing**: Local production and import substitution
- **Services**: Consulting, education, and healthcare
- **E-commerce**: Online retail and digital services

**Support Services:**
- **Funding Access**: Connection to investors and grants
- **Legal Support**: Business registration and IP protection
- **Marketing**: Brand development and market access
- **Networking**: Industry events and partnerships
- **Workspace**: Co-working spaces and offices

**Industry Partnerships:**
- **Corporate Collaborations**: Partnerships with major companies
- **Government Support**: Policy advocacy and funding
- **International Networks**: Global entrepreneurship programs
- **Alumni Network**: Successful entrepreneurs mentoring students

**My questions:**
1. How can I join the entrepreneurship program?
2. What funding opportunities are available?
3. How competitive are the accelerator programs?
4. What support is available after graduation?

**For entrepreneurs:**
- What business are you building?
- How has KNUST helped your startup?
- What challenges are you facing?

**For students:**
- What business ideas are you working on?
- How can you get involved in entrepreneurship?
- What skills do you need to develop?

Let's build the future of Ghana's economy! 💼

#KNUST #Entrepreneurship #Startups #Innovation`,
    author: mockUsers[4],
    tags: ['KNUST', 'entrepreneurship', 'startups', 'innovation', 'business'],
    answers: [],
    comments: [],
    images: [
      'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'
    ],
    upvotes: 198,
    downvotes: 8,
    views: 4123,
    isAnswered: false,
    userVote: null,
    createdAt: new Date('2023-12-30T14:15:00'),
    updatedAt: new Date('2023-12-30T14:15:00'),
  },
];

// Mock notifications
export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'answer',
    title: 'New Answer',
    message: 'John Doe answered your question about React Native authentication',
    isRead: false,
    createdAt: new Date('2024-01-15T10:30:00'),
    relatedId: '1',
  },
  {
    id: '2',
    type: 'upvote',
    title: 'Upvote Received',
    message: 'Your answer received an upvote',
    isRead: false,
    createdAt: new Date('2024-01-15T09:15:00'),
    relatedId: '2',
  },
  {
    id: '3',
    type: 'follow',
    title: 'New Follower',
    message: 'Jane Smith started following you',
    isRead: true,
    createdAt: new Date('2024-01-14T16:45:00'),
    relatedId: '3',
  },
  {
    id: '4',
    type: 'comment',
    title: 'New Comment',
    message: 'Mike Johnson commented on your question about TypeScript',
    isRead: false,
    createdAt: new Date('2024-01-14T14:20:00'),
    relatedId: '4',
  },
  {
    id: '5',
    type: 'mention',
    title: 'You were mentioned',
    message: 'Sarah Wilson mentioned you in a comment',
    isRead: false,
    createdAt: new Date('2024-01-14T11:30:00'),
    relatedId: '5',
  },
  {
    id: '6',
    type: 'upvote',
    title: 'Upvote Received',
    message: 'Your question about Redux Toolkit received 3 upvotes',
    isRead: true,
    createdAt: new Date('2024-01-13T18:45:00'),
    relatedId: '6',
  },
  {
    id: '7',
    type: 'answer',
    title: 'New Answer',
    message: 'Alex Chen answered your question about Expo push notifications',
    isRead: true,
    createdAt: new Date('2024-01-13T15:10:00'),
    relatedId: '7',
  },
  {
    id: '8',
    type: 'follow',
    title: 'New Follower',
    message: 'Emily Davis started following you',
    isRead: true,
    createdAt: new Date('2024-01-12T20:30:00'),
    relatedId: '8',
  },
];

// Helper functions
export const getQuestionById = (id: string): Question | undefined => {
  return mockQuestions.find(q => q.id === id);
};

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(u => u.id === id);
};

export const getQuestionsByTag = (tagName: string): Question[] => {
  return mockQuestions.filter(q => q.tags.includes(tagName));
};

export const searchQuestions = (query: string): Question[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockQuestions.filter(q => 
    q.title.toLowerCase().includes(lowercaseQuery) ||
    q.content.toLowerCase().includes(lowercaseQuery) ||
    q.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}; 

export const searchUsers = (query: string): User[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockUsers.filter(u =>
    u.username.toLowerCase().includes(lowercaseQuery) ||
    u.email.toLowerCase().includes(lowercaseQuery) ||
    (u.bio && u.bio.toLowerCase().includes(lowercaseQuery))
  );
}; 