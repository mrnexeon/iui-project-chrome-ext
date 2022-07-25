# YouLearn

## Prerequisites
As YouLearn's backend server has no SSL certificate we have to tweak chrome in order for chrome to not block our requests. If we would release this project to the public we would sort this out, but for now it is fine.

### Tweak chrome's settings to accept mixed content for YouTube
1. Open Youtube
2. Click on the lock in front of the URL
<img width="502" alt="image" src="https://user-images.githubusercontent.com/53370847/180845576-2738b82e-2b34-4547-bde0-871ca67c579b.png">
3. Click on "Site settings"
<img width="363" alt="image" src="https://user-images.githubusercontent.com/53370847/180845679-183c983d-ceeb-4af3-96b7-b811907808bc.png">
4. Under "Permissions" locate "Insecure content" and change to "Allow"
<img width="638" alt="image" src="https://user-images.githubusercontent.com/53370847/180845834-ba93a318-76bc-4872-9c3b-37f6b558e8e4.png">

## How to use / install YouLearn
In this section are two ways described to get YouLearn to run:

### Use the release
Download and install this release: https://github.com/mrnexeon/iui-project-chrome-ext/releases/tag/v0.0.1
In order to install the extension drag the extension file into chrome under "Manage extensions"

### Build it yourself
You need NodeJS v16 and NPM for the following steps.
1. Clone this repository
2. Navigate into the folder and run `npm install`
3. Build the extension
4. Buid the extension

Use `npm run build` to build a production version of the extension **OR**
Use `npm start` to build for developement
> The development build gets rebuilt after saving of a file and reloads the extension and sites in chrome

5. Regardless of your building method (production or developement) the built extension is saved under `dist/`. To install the extension in chrome go to **Three dots > More tools > Extensions** or go to `chrome://extensions/`. Activate **Developer mode** in the top right corner. Then you can either drag the `dist/` folder into chrome or click on **Load unpacked** in the top left corner and choose the `dist/` directory.
  
  Congratulations! You have installed YouLean in your chrome browser. We recommend that you pin it for easy access.
