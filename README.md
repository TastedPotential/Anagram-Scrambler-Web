# Anagram-Scrambler-Web
A web-hosted p5.js version of my Anagram Scrambler Processing project.
I've come to realize that these are not true anagrams in the sense that the text is not being checked a dictionary to make real words.
Instead, the project was intended to allow the user to quickly test various randomized combinations of characters. Ideally, this is for fictional names and words.

[Here's a link to the webpage.](https://tastedpotential.github.io/Anagram-Scrambler-Web/)

# Instructions
Type into the text box, then exit editing mode by pressing enter or clicking the edit button (pencil button).
Outside of editing mode, you can:
- Scramble text (spinning arrows button)
- Save scrambles (down arrow over line button)
- Enter grouping mode (two arrows meeting in the middle button)
- Enter locking mode (lock button)
- Copy a scramble to your clipboard by clicking on a saved scramble
- Delete an individual saved scramble by clicking the red X next to it
- Delete all saved scrambles by clicking the big X button in the corner on desktop or at the bottom of the screen on touch devices

## Grouping Mode
While in grouping mode, you can connect adjacent characters. This keeps them connected to each other even after being scrambled.
To make a group, click & hold on a starting character, then drag to the end of your desired group, and finally let go of the mouse button.
If the attempted group is valid (there are no existing grouped or locked characters in your attempted group) a bracket will be drawn under the group you created.
To delete a group, click on the bracket below said group.

## Locking Mode
While in locking mode, you can toggle the locked status of a single character or a group of characters by clicking on a single or grouped character.
While locked, the character/group will retain its relative position in the text. When scrambling, a locked group is treated as a single character.
For example, if you lock the last character in the text, it will always be at the end of the text after scrambling. If a locked group is at the end of the text,
it will always be at the end just like a single locked character.

# Keyboard Shortcuts
When not in editing mode, you can use the following keyboard shortcuts:
Spacebar = Scramble text
Insert = Save scramble
Enter/Return = Enter/Exit editing mode

# Android Differences
On Android, instead of clicking and dragging to make a group, tap once to choose the start of the group then tap again on another character to set the end of the group.