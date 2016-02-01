```
This project was abandoned
```

Mazes
===

Amazeing is an ambitious massively multiplayer online role-playing game made with javascript.

![amazeing](http://i.imgur.com/IJKZIqU.png)

Some of the key features:

- Random mazes generation
- Multiplayer crossplatform
- Biomes
- Character customization
- PvP
- Mobs with CI of, at least, 120 ;)
- Fun

This project is in development, thanks!

### Instalation ###
* Clone repo
* Install [NodeJS](http://nodejs.org/download/) and
* install [Gulp](https://github.com/gulpjs/gulp/):
```bash
$ sudo npm install gulp -g
```
* Install Node dependencies:
```bash
$ npm install
```
* Install Bower resources:
```bash
$ bower install
```

### How to run locally? ###
To build the project:
```bash
$ gulp build
```

To run on development mode:
```bash
$ gulp dev
```
After build, go to [http://127.0.0.1:3000/](http://127.0.0.1:3000/) on your favorite web browser with full HTML5 support. 
By default gulp will __build__ the project.

To deploy, set the following environment var on __staging__
```bash
$ export NODE_ENV=staging
```

### Rules to add code ###

* Fork this project
* Make your changes
* Pull Fork request

Any pull request that doesn't merge cleanly will be rejected.
