## ThreeSixty

360 panoramic image presentation based on three.js.

### Examples

* [basic example](heganoo.github.io/ThreeSixty/examples).
* [heganoo.com story map 'North America 360'](http://heganoo.com/node/8177/8179).

#### Using the code

Include ThreeSixty.js and three.js lib.

```html
<script src="//cdnjs.cloudflare.com/ajax/libs/three.js/r68/three.min.js"></script>
<script src="ThreeSixty.js"></script>
````

Add this basic code:
```js
var vars = {
	image: 'https://dl.dropboxusercontent.com/u/153646388/360/bergsjostolen.jpg',
	canvas: null,
	mobile: false,
	containerID: 'container',
	controls: {
			pause: true,
			littlePlanet: true,
			fullWidth: false
	}
}
threeSixty( vars );
```

Forks, pull requests and code critiques are welcome!
