import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonProps {
  eventId: string;
  eventTitle: string;
  eventDate: string;
}

const ShareButton = ({ eventId, eventTitle, eventDate }: ShareButtonProps) => {
  const { toast } = useToast();
  const eventUrl = `${window.location.origin}/event/${eventId}`;
  const shareText = `Check out ${eventTitle} on ${new Date(eventDate).toLocaleDateString()}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: eventTitle,
          text: shareText,
          url: eventUrl
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Share failed:', error);
        }
      }
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(eventUrl);
    toast({
      title: 'Link copied!',
      description: 'Event link has been copied to clipboard.'
    });
  };

  const shareToEmail = () => {
    window.open(`mailto:?subject=${encodeURIComponent(eventTitle)}&body=${encodeURIComponent(`${shareText}\n\n${eventUrl}`)}`);
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(eventUrl)}`);
  };

  const shareToFacebook = () => {
    window.open(`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`);
  };

  const shareToWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${eventUrl}`)}`);
  };

  // If native share is available, use it
  if (navigator.share) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleShare}
        className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm hover:bg-background"
      >
        <Share2 className="w-4 h-4" />
      </Button>
    );
  }

  // Otherwise show dropdown menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm hover:bg-background"
        >
          <Share2 className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={copyLink}>
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareToEmail}>
          Share via Email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareToTwitter}>
          Share on Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareToFacebook}>
          Share on Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareToWhatsApp}>
          Share on WhatsApp
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareButton;
