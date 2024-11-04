import {fromEvent, map, tap, merge, shareReplay} from "rxjs";

const form = document.getElementById("form")!;
const submitEvents$ = fromEvent<FormDataEvent>(form, 'submit');

const userMessages$ = submitEvents$.pipe(
    tap(e => e.preventDefault()),
    map(e => {
        const messageInput: HTMLInputElement = ((e.currentTarget as HTMLFormElement).querySelector('input[name="message"]')!);
        const message = messageInput.value;
        messageInput.value = ""; // Side-effect
        return message;
    }),
    map((message: string): Message => {
        return {data: message, action: "sent", timestamp: new Date()};
    }),
    shareReplay()
);

userMessages$.subscribe(message => {
    const newMessage = document.createElement("li");
    newMessage.innerHTML = `
        <div>
            <p class="message-text">${message.data}</p>
            <p class="message-date">${message.action} ${new Date(message.timestamp).toLocaleString()}</p>
        </div>
    `;
    newMessage.classList.add(message.action);
    document.getElementById("messages")!.appendChild(newMessage);
});