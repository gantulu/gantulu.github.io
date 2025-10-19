
export interface StepProps {
  onNext: () => void;
}

export interface Testimonial {
  name: string;
  avatarUrl: string;
  text: string;
  income: string;
}

export interface ChatMessage {
    id: number;
    sender: string;
    avatarUrl: string;
    text: string;
    isOwn: boolean;
}
