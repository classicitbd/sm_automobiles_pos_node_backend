import ApiError from "../../errors/ApiError";
import { ISiteSettingInterface } from "./site_setting.interface";
import SiteSettingModel from "./site_setting.model";

// get A SiteSetting
export const getSiteSettingServices = async (): Promise<
  ISiteSettingInterface[] | any
> => {
  const getSiteSetting: ISiteSettingInterface | {} =
    await SiteSettingModel.find({});
  return getSiteSetting;
};

// Create A SiteSetting
export const postSiteSettingServices = async (
  data: ISiteSettingInterface
): Promise<ISiteSettingInterface | {}> => {
  const createSiteSetting: ISiteSettingInterface | {} =
    await SiteSettingModel.create(data);
  return createSiteSetting;
};

// update A SiteSetting
export const updateSiteSettingServices = async (
  data: ISiteSettingInterface
): Promise<ISiteSettingInterface | any> => {
  const settingData = await SiteSettingModel.findOne({ _id: data?._id });
  if (!settingData) {
    throw new ApiError(400, "Nothing found for update");
  }
  const updateSetting = await SiteSettingModel.updateOne(
    { _id: data?._id },
    data,
    {
      runValidators: true,
    }
  );
  return updateSetting;
};
