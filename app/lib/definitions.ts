export interface Record {
    status: string;
    collision_index: string;
    collision_year: string;
    collision_reference: string;
    location_easting_osgr: number;
    location_northing_osgr: number;
    longitude: number;
    latitude: number;
    police_force: string;
    legacy_collision_severity: string;
    number_of_vehicles: number;
    number_of_casualties: number;
    date_recorded: string;
    day_of_week: string;
    time_recorded: string;
    local_authority_district: string;
    local_authority_ons_district: string;
    local_authority_highway: string;
    first_road_class: number;
    first_road_number: number;
    road_type: string;
    speed_limit: string;
    junction_detail: string;
    junction_control: string;
    second_road_class: string;
    second_road_number: string;
    pedestrian_crossing_human_control: string;
    pedestrian_crossing_physical_facilities: string;
    light_conditions: number;
    weather_conditions: number;
    road_surface_conditions: string;
    special_conditions_at_site: string;
    carriageway_hazards: string;
    urban_or_rural_area: string;
    did_police_officer_attend_scene_of_collision: string;
    trunk_road_flag: string;
    lsoa_of_collision_location: string;
    enhanced_severity_collision: string;
};

export interface CollisionMarkerProperties {
    collision_reference: string;
    date_recorded: string;
    time_recorded: string;
    longitude: number;
    latitude: number;
    first_road_class: number;
    first_road_number: number;
    legacy_collision_severity: number;
};

export interface SearchFormProps {
    onSearch: (location: string) => void;
}

export type KpiEntry = {
    title: string
    percentage: number
    current: number
    allowed: number
    unit?: string
}


export type KpiEntryExtended = Omit<
  KpiEntry,
  "current" | "allowed" | "unit"
> & {
  value: string
  color: string
}

export interface SeverityProperties {
    legacy_collision_severity: number;
}