Vue.filter('date', time => moment(time).format('DD/MM/YY, HH:mm'));

// New VueJS Instance
new Vue({
    // CSS selector of the root DOM element
    el: '#notebook',
    // Some data
    data () {
        return {
            notes: JSON.parse(localStorage.getItem('notes')) || [],
            selectedId: localStorage.getItem('selected-id') || null
        }
    },
    // Computed properties
    computed: {
      selectedNote () {
        // We return the matching note with slectedid
        return this.notes.find(note => note.id === this.selectedId)
      },
      notePreview () {
          // Markdown rendered to html
          return this.selectedNote ? marked(this.selectedNote.content) : ''
      },
      sortedNotes () {
        return this.notes.slice()
          .sort((a, b) => a.created - b.created)
          .sort((a, b) => (a.favorite === b.favorite)? 0 : a.favorite? -1 : 1)
      },
      linesCount () {
        if (this.selectedNote) {
          // Count the number of new line characters
          return this.selectedNote.content.split(/\r\n|\r|\n/).length
        }
      },
      wordsCount() {
        if (this.selectedNote) {
          var s = this.selectedNote.content
          // Turn new line characters into white-spaces
          s = s.replace(/\n/g, '')
          // Exclude start and end whites-spaces
          s = s.replace(/(^\s*)|(\s*$)/gi, '')
          // Return the number of spaces
          return s.split(' ').length
        }
      },
      charactersCount() {
        if (this.selectedNote) {
          return this.selectedNote.content.split('').length
        }
      }
    },
    // Change watchers
    watch: {
        // Watching notes data property
        notes: {
          // The method name
          handler: 'saveNotes',
          // We need to watch each note's properties inside the array
          deep: true
        },
        // Save the selection
        selectedId (val) {
          localStorage.setItem('selected-id', val)
        }
    },
    methods: {
      // Add a note with some default content and select it
      addNote () {
        const time = Date.now();
        // Default new note
        const note = {
         id: String(time),
         title: 'New note ' + (this.notes.length + 1),
         content: '**Hi!** This notebook is using [markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) for formatting!',
         created: time,
         favorite: false,
       }
        // Add to the list
        this.notes.push(note)
      },
      selectNote (note) {
        this.selectedId = note.id;
      },
      saveNote (val, oldVal) {
        console.log('new note:', val, 'old note:', oldVal);
        console.log('saving note:', val);
        localStorage.setItem('content', val);
        this.reportOperation('saving');
      },
      saveNotes () {
        // Don't forget to stringify to JSON before storing
        localStorage.setItem('notes', JSON.stringify(this.notes));
        console.log('Notes saved!', new Date());
      },
      removeNote () {
        if (this.selectedNote && confirm('Delete the note?')) {
          // Remove the note in notes array
          const index = this.notes.indexOf(this.selectedNote)
          if (index !== -1) {
            this.notes.splice(index, 1)
          }
        }
      },
      favoriteNote() {
        this.selectedNote.favorite ^= true
      },
      reportOperation (opName) {
        console.log('The', opName, 'operation was completed');
        console.log('restored note:', localStorage.getItem('content'));
      }
    }


})
