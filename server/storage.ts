type VenueInput = {
  website?: string;
  description?: string;
  capacity?: number;
  imageUrl?: string;
};

type EventInput = {
  description?: string;
  imageUrl?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
};

type ArtistInput = {
  website?: string;
  description?: string;
  imageUrl?: string;
  genre?: string;
};

type EventArtistInput = {
  isHeadliner?: boolean;
};

function mapVenue(input: VenueInput) {
  return {
    website: input.website ?? null,
    description: input.description ?? null,
    capacity: input.capacity ?? null,
    imageUrl: input.imageUrl ?? null
  };
}

function mapEvent(input: EventInput) {
  return {
    description: input.description ?? null,
    imageUrl: input.imageUrl ?? null,
    endDate: input.endDate ?? null,
    startTime: input.startTime ?? null,
    endTime: input.endTime ?? null,
    status: input.status ?? null
  };
}

function mapArtist(input: ArtistInput) {
  return {
    website: input.website ?? null,
    description: input.description ?? null,
    imageUrl: input.imageUrl ?? null,
    genre: input.genre ?? null
  };
}

function mapEventArtist(input: EventArtistInput) {
  return {
    isHeadliner: input.isHeadliner ?? null
  };
}
