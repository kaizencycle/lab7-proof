from .models import MentorName


def route_to_mentors(prompt: str, mentors: list[MentorName]) -> dict[MentorName, str]:
    # STUB: return playful drafts; replace with real SDK calls
    replies: dict[MentorName, str] = {}
    for m in mentors:
        replies[m] = f"[{m}] draft for: {prompt[:80]}..."
    return replies
