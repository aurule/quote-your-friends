<template>
  <q-page class="flex justify-center">
    <div style="width: 80%">
      <div class="row justify-center">
        <h3>Edit a Quote</h3>
      </div>
      <q-form @submit="onSubmit" @reset="onReset">
        <div class="row">
          <div class="col-grow">Recorded by @{{ eQuote.quoter.name }}</div>
          <div class="col text-right">
            <q-btn label="Save" type="submit" color="primary" id="saveButton" :loading="saving" :disable="reloading" />
            <q-btn flat label="Reset" type="reset" color="primary" class="q-ml-sm" id="resetButton" :disabled="saving" :loading="reloading" />
          </div>
        </div>

        <div class="row">
          <q-input
            v-model="eQuote.context"
            label="Context"
            hint="A few words that describe circumstances of the quote (optional)"
            class="col"
          />
        </div>

        <div class="row q-mt-md">
          <h5 class="q-my-sm">Quote Contents</h5>
        </div>

        <div class="row">
          <div class="col-grow">
            <q-list bordered separator class="q-my-md">
              <draggable
                v-model="eQuote.Lines"
                item-key="id"
                group="lines"
                handle=".line-handle"
                @start="dragging = true"
                @end="updateOrder()"
                tag="div"
                :component-data="{
                  as: 'transition-group',
                  type: 'transition-group',
                  name: !dragging ? 'flip-list' : null,
                }"
                v-bind="{
                  animation: 200,
                }"
              >
                <template #item="{ element }">
                  <q-item dense>
                    <q-item-section side>
                      <q-icon name="menu" class="line-handle" />
                    </q-item-section>
                    <q-item-section side>
                      <q-select
                        v-model="element.speakerId"
                        :options="speakerOptions"
                        label="Speaker"
                        option-value="id"
                        option-label="name"
                        emit-value
                        map-options
                        dense
                      />
                    </q-item-section>
                    <q-item-section side>
                      <q-input
                        v-model="element.speakerAlias"
                        placeholder="Same as speaker name"
                        label="Alias"
                        dense
                      />
                    </q-item-section>
                    <q-item-section dense>
                      <q-input
                        v-model="element.content"
                        placeholder="Line text"
                        label="Line contents"
                        lazy-rules
                        :rules="[ val => val && val.length > 0 || 'Type what was said, or delete the line']"
                      />
                    </q-item-section>
                    <q-item-section side>
                      <q-btn
                        icon="delete"
                        flat
                        round
                        color="gray"
                        @click="deleteLine(element)"
                      />
                    </q-item-section>
                  </q-item>
                </template>
              </draggable>
            </q-list>
          </div>
        </div>

        <div class="row">
          <div>
            <q-btn
              icon="add"
              label="Add Line"
              flat
              color="primary"
              @click="addLine"
            />
          </div>
        </div>

        <div class="row">
          <pre>{{ eQuote }}</pre>
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from "vue"

export default defineComponent({
  name: "PageFixquote",
  props: {
    shortcode: {
      type: String,
      required: true,
    },
  },
  components: {
    draggable,
  },
})
</script>

<script setup>
import { useQuasar } from "quasar"
import { ref, reactive } from "vue"
import draggable from "vuedraggable"

const $q = useQuasar()

// connect to DB as special fixquote user
// set shortcode as session var in DB
// const quote = Quotes.findOne(...), include [quoter, Lines]
// load guild users
// const eQuote = reactive(quote)

// test object!
const eQuote = reactive({
  context: "",
  Lines: [
    {
      id: 1,
      lineOrder: 0,
      speakerId: 2,
      speakerAlias: "Kitten",
      content: "Which is why he's absolutely *fucked* on DMT!",
    },
    {
      id: 2,
      lineOrder: 1,
      speakerId: 1,
      speakerAlias: "BIG D",
      content: "That is *totally* why I did that!",
    },
  ],
  quoter: {
    id: 2,
    name: "TestyBoi",
  },
})

// load from database with Users.find() on participation.guild_id = quote.guild_id
const speakerOptions = [
  {
    id: 1,
    name: "Alfabusa",
  },
  {
    id: 2,
    name: "TestyBoi",
  },
]

let dragging = false
const saving = ref(false)
const reloading = ref(false)

function updateOrder() {
  eQuote.Lines.forEach((line, index) => (line.lineOrder = index))

  dragging = false
}

function onSubmit() {
  console.log("submitted")

  saving.value = true
  Promise.all([
    new Promise(resolve => setTimeout(resolve, 1000))
    // ...eQuote.Lines.map(line => line.save())
    // eQuote.save(),
  ])
    .then(() => {
      saving.value = false
      // show success notice using $q.notify(...)
    })
    .catch((err) => {
      // disable save button
      // color save button red
      // show error warning
      saving.value = false
    })
}

function onReset() {
  reloading.value = true

  // should be as easy as eQuote.reload() I think?
  new Promise(resolve => setTimeout(resolve, 1000))
    .then(() => {
      reloading.value = false
      // show success notice using $q.notify(...)
    })
    .catch((err) => {
      // disable save button
      // color save button red
      // show error warning
      reloading.value = false
    })
}

function deleteLine(line) {
  // call eQuote.removeLine(line)
  // does it update the model object?
}

function addLine() {
  // call eQuote.createLine() using the same speaker and speaker alias as the last entry in eQuote.Lines
  // does it update the model object?
}
</script>

<style>
.sortable-ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.line-handle {
  cursor: move;
}

.del-btn {
  cursor: pointer;
}
</style>
