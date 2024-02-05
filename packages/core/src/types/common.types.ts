import { IGenericFeatureProps } from '../components/GenericFeature';

export interface IFeature extends IGenericFeatureProps {
  name: string;
  id: string;
}

export interface IApp {
  name: string;
  type: string;
  features: IFeature[];

  assets?: any;
  styles?: any;
}
