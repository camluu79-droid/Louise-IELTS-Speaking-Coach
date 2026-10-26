export const questions = {
  1: [
    ['Home', 'What do you like most about the place where you live?'],
    ['Work & study', 'Do you work or are you a student? What do you enjoy about it?'],
    ['Free time', 'What do you usually do in your free time?'],
    ['Food', 'What kind of food do you enjoy eating?'],
    ['Travel', 'How do you usually travel around your town or city?'],
    ['Music', 'What kind of music do you like listening to?'],
    ['Friends', 'How often do you spend time with your friends?'],
    ['Weather', 'What is your favourite type of weather?'],
    ['Reading', 'Do you prefer reading books or watching films? Why?'],
    ['Daily routines', 'What do you usually do at the weekend?']
  ].map(([topic, prompt]) => ({topic, prompt})),
  2: [
    ['A memorable journey', 'Describe a journey that you particularly enjoyed.', ['where you went', 'who you travelled with', 'what you did during the journey'], 'why this journey was memorable.'],
    ['Someone who inspires you', 'Describe a person who has inspired you.', ['who this person is', 'how you know them', 'what they have done'], 'why this person inspires you.'],
    ['A useful skill', 'Describe a useful skill you have learned.', ['what the skill is', 'when you learned it', 'how you learned it'], 'why this skill is useful to you.'],
    ['A special meal', 'Describe a special meal you had.', ['where you had it', 'who you ate with', 'what you ate'], 'why this meal was special.'],
    ['A book you enjoyed', 'Describe a book you enjoyed reading.', ['what the book is', 'when you read it', 'what it is about'], 'why you enjoyed reading it.'],
    ['A peaceful place', 'Describe a place where you like to relax.', ['where it is', 'what it looks like', 'what you do there'], 'why you find this place relaxing.'],
    ['A helpful invention', 'Describe an invention that helps you in everyday life.', ['what it is', 'when you started using it', 'how you use it'], 'how it has made your life easier.'],
    ['An achievement', 'Describe something you achieved that made you proud.', ['what you achieved', 'when it happened', 'what you did to achieve it'], 'why you felt proud.'],
    ['An outdoor activity', 'Describe an outdoor activity you would like to try.', ['what the activity is', 'where you would do it', 'who you would do it with'], 'why you would like to try it.'],
    ['A time you helped', 'Describe a time when you helped someone.', ['who you helped', 'what help they needed', 'what you did'], 'how you felt about helping them.']
  ].map(([topic, prompt, points, explain]) => ({topic, prompt, points, explain})),
  3: [
    ['Travel & society', 'How can tourism affect the lives of people in local communities?'],
    ['Education', 'Should schools focus more on practical skills or academic knowledge?'],
    ['Technology', 'How has technology changed the way people communicate?'],
    ['Environment', 'Who should take more responsibility for protecting the environment: individuals or governments?'],
    ['Work', 'Why do some people prefer to work for themselves?'],
    ['Culture', 'Why is it important to preserve traditional celebrations?'],
    ['Cities', 'What can governments do to make cities better places to live?'],
    ['Media', 'How might social media influence young people’s opinions?'],
    ['Health', 'What could encourage people to lead healthier lifestyles?'],
    ['Success', 'Do you think the meaning of success has changed between generations?']
  ].map(([topic, prompt]) => ({topic, prompt}))
};
export function remainingSeconds(deadline, now = Date.now()) { return Math.max(0, Math.ceil((deadline - now) / 1000)); }
export function formatTime(seconds) { return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`; }
