import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Skeleton, { 
  NewsCardSkeleton, 
  NewsGridSkeleton, 
  GalleryCardSkeleton,
  EventCardSkeleton 
} from '../components/Skeleton';

describe('Skeleton Components', () => {
  it('renders Skeleton with text variant', () => {
    const { container } = render(<Skeleton variant="text" />);
    expect(container.firstChild).toHaveClass('animate-pulse');
  });

  it('renders Skeleton with custom className', () => {
    const { container } = render(<Skeleton variant="text" className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders NewsCardSkeleton correctly', () => {
    const { container } = render(<NewsCardSkeleton />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders NewsGridSkeleton with correct count', () => {
    const { container } = render(<NewsGridSkeleton count={3} />);
    const cards = container.querySelectorAll('.animate-pulse');
    expect(cards.length).toBeGreaterThanOrEqual(3);
  });

  it('renders GalleryCardSkeleton correctly', () => {
    const { container } = render(<GalleryCardSkeleton />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders EventCardSkeleton correctly', () => {
    const { container } = render(<EventCardSkeleton />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
