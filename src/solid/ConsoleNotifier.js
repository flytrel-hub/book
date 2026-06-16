class ConsoleNotifier {
    send(message) {
        console.log(`[Уведомление]: ${message}`);
    }
}

if (typeof module !== 'undefined') module.exports = ConsoleNotifier;
