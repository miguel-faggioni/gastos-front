Object.defineProperty(Array.prototype, 'shuffle', {
  value: function() {
    let counter = this.length

    // While there are elements in the this
    while (counter > 0) {
      // Pick a random index
      let index = Math.floor(Math.random() * counter)

      // Decrease counter by 1
      counter--

      // And swap the last element with it
      let temp = this[counter]
      this[counter] = this[index]
      this[index] = temp
    }

    return this
  },
})
