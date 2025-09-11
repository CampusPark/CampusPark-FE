export async function speakKo(text: string): Promise<void> {
  if (!("speechSynthesis" in window)) return alert(text);
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text);
    const pickVoice = () =>
      speechSynthesis.getVoices().find((v) => v.lang.startsWith("ko"));
    let voice = pickVoice();
    if (!voice)
      speechSynthesis.onvoiceschanged = () => {
        voice = pickVoice();
        u.voice = voice!;
        speechSynthesis.speak(u);
      };
    else u.voice = voice;

    u.rate = 1.0;
    u.pitch = 1.0;
    u.onend = () => resolve();
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  });
}
