import { ChannelCollectionData } from "@dashboard/channels/utils";
import { collectionListUrl } from "@dashboard/collections/urls";
import { Backlink } from "@dashboard/components/Backlink";
import { CardSpacer } from "@dashboard/components/CardSpacer";
import ChannelsAvailabilityCard from "@dashboard/components/ChannelsAvailabilityCard";
import { Container } from "@dashboard/components/Container";
import Grid from "@dashboard/components/Grid";
import Metadata from "@dashboard/components/Metadata/Metadata";
import PageHeader from "@dashboard/components/PageHeader";
import Savebar from "@dashboard/components/Savebar";
import SeoForm from "@dashboard/components/SeoForm";
import {
  CollectionChannelListingErrorFragment,
  CollectionDetailsQuery,
  CollectionErrorFragment,
  PermissionEnum,
} from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { ChannelProps, ListActions, PageListProps } from "../../../types";
import CollectionDetails from "../CollectionDetails/CollectionDetails";
import { CollectionImage } from "../CollectionImage/CollectionImage";
import CollectionProducts from "../CollectionProducts/CollectionProducts";
import CollectionUpdateForm, { CollectionUpdateData } from "./form";

export interface CollectionDetailsPageProps
  extends PageListProps,
    ListActions,
    ChannelProps {
  onAdd: () => void;
  channelsCount: number;
  channelsErrors: CollectionChannelListingErrorFragment[];
  collection: CollectionDetailsQuery["collection"];
  currentChannels: ChannelCollectionData[];
  errors: CollectionErrorFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onCollectionRemove: () => void;
  onImageDelete: () => void;
  onImageUpload: (file: File) => void;
  onProductUnassign: (id: string, event: React.MouseEvent<any>) => void;
  onSubmit: (data: CollectionUpdateData) => SubmitPromise;
  onChannelsChange: (data: ChannelCollectionData[]) => void;
  openChannelsModal: () => void;
}

const CollectionDetailsPage: React.FC<CollectionDetailsPageProps> = ({
  channelsCount,
  channelsErrors,
  collection,
  currentChannels = [],
  disabled,
  errors,
  saveButtonBarState,
  onCollectionRemove,
  onImageDelete,
  onImageUpload,
  onSubmit,
  onChannelsChange,
  openChannelsModal,
  ...collectionProductsProps
}: CollectionDetailsPageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();

  return (
    <CollectionUpdateForm
      collection={collection}
      currentChannels={currentChannels}
      setChannels={onChannelsChange}
      onSubmit={onSubmit}
      disabled={disabled}
    >
      {({ change, data, handlers, submit, isSaveDisabled }) => (
        <Container>
          <Backlink href={collectionListUrl()}>
            {intl.formatMessage(sectionNames.collections)}
          </Backlink>
          <PageHeader title={collection?.name} />
          <Grid>
            <div>
              <CollectionDetails
                data={data}
                disabled={disabled}
                errors={errors}
                onChange={change}
              />
              <CardSpacer />
              <CollectionImage
                data={data}
                image={collection?.backgroundImage}
                onImageDelete={onImageDelete}
                onImageUpload={onImageUpload}
                onChange={change}
              />
              <CardSpacer />
              <Metadata data={data} onChange={handlers.changeMetadata} />
              <CardSpacer />
              <CollectionProducts
                disabled={disabled}
                collection={collection}
                {...collectionProductsProps}
              />
              <CardSpacer />
              <SeoForm
                description={data.seoDescription}
                disabled={disabled}
                descriptionPlaceholder=""
                helperText={intl.formatMessage({
                  id: "Rj8LxK",
                  defaultMessage:
                    "Add search engine title and description to make this collection easier to find",
                })}
                errors={errors}
                slug={data.slug}
                slugPlaceholder={data.name}
                title={data.seoTitle}
                titlePlaceholder={collection?.name}
                onChange={change}
              />
            </div>
            <div>
              <div>
                <ChannelsAvailabilityCard
                  managePermissions={[PermissionEnum.MANAGE_PRODUCTS]}
                  messages={{
                    hiddenLabel: intl.formatMessage({
                      id: "V8FhTt",
                      defaultMessage: "Hidden",
                      description: "collection label",
                    }),

                    visibleLabel: intl.formatMessage({
                      id: "9vQR6c",
                      defaultMessage: "Visible",
                      description: "collection label",
                    }),
                  }}
                  errors={channelsErrors}
                  allChannelsCount={channelsCount}
                  channels={data.channelListings}
                  disabled={disabled}
                  onChange={handlers.changeChannels}
                  openModal={openChannelsModal}
                />
              </div>
            </div>
          </Grid>
          <Savebar
            state={saveButtonBarState}
            disabled={isSaveDisabled}
            onCancel={() => navigate(collectionListUrl())}
            onDelete={onCollectionRemove}
            onSubmit={submit}
          />
        </Container>
      )}
    </CollectionUpdateForm>
  );
};
CollectionDetailsPage.displayName = "CollectionDetailsPage";
export default CollectionDetailsPage;
